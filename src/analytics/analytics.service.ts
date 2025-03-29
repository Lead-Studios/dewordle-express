import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, Between } from "typeorm"
import { Event } from "../events/entities/event.entity"
import { Ticket } from "../events/entities/ticket.entity"
import { TicketTier } from "../events/entities/ticket-tier.entity"
import { Attendee } from "../events/entities/attendee.entity"
import type { RedisService } from "../redis/redis.service"

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketTier)
    private ticketTierRepository: Repository<TicketTier>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
    private redisService: RedisService,
  ) {}

  private async getCachedOrFetch<T>(key: string, ttl: number, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.redisService.get(key)
    if (cached) {
      return cached as T
    }

    const data = await fetchFn()
    await this.redisService.set(key, data, ttl)
    return data
  }

  async getEventSalesOverview(eventId: string) {
    const cacheKey = `event:${eventId}:sales:overview`
    return this.getCachedOrFetch(cacheKey, 60, async () => {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
        relations: ["tickets", "tickets.ticketTier"],
      })

      if (!event) {
        throw new Error("Event not found")
      }

      const ticketTiers = await this.ticketTierRepository.find({
        where: { event: { id: eventId } },
      })

      const totalTickets = ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0)
      const soldTickets = ticketTiers.reduce((sum, tier) => sum + tier.sold, 0)
      const remainingTickets = totalTickets - soldTickets

      const totalRevenue = event.tickets.reduce((sum, ticket) => {
        return sum + Number(ticket.ticketTier.price)
      }, 0)

      return {
        totalTickets,
        soldTickets,
        remainingTickets,
        totalRevenue,
        percentageSold: totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0,
      }
    })
  }

  async getRevenueBreakdown(eventId: string) {
    const cacheKey = `event:${eventId}:revenue:breakdown`
    return this.getCachedOrFetch(cacheKey, 60, async () => {
      const ticketTiers = await this.ticketTierRepository.find({
        where: { event: { id: eventId } },
      })

      const revenueByTier = await Promise.all(
        ticketTiers.map(async (tier) => {
          const tickets = await this.ticketRepository.count({
            where: { ticketTier: { id: tier.id } },
          })

          return {
            tierName: tier.name,
            ticketsSold: tier.sold,
            revenue: tier.sold * Number(tier.price),
            pricePerTicket: tier.price,
          }
        }),
      )

      return revenueByTier
    })
  }

  async getAttendeeDemographics(eventId: string) {
    const cacheKey = `event:${eventId}:attendee:demographics`
    return this.getCachedOrFetch(cacheKey, 300, async () => {
      const attendees = await this.attendeeRepository.find({
        where: { event: { id: eventId } },
      })

      // Age distribution
      const ageGroups = {
        "Under 18": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45-54": 0,
        "55+": 0,
        Unknown: 0,
      }

      attendees.forEach((attendee) => {
        if (!attendee.age) {
          ageGroups["Unknown"]++
        } else if (attendee.age < 18) {
          ageGroups["Under 18"]++
        } else if (attendee.age <= 24) {
          ageGroups["18-24"]++
        } else if (attendee.age <= 34) {
          ageGroups["25-34"]++
        } else if (attendee.age <= 44) {
          ageGroups["35-44"]++
        } else if (attendee.age <= 54) {
          ageGroups["45-54"]++
        } else {
          ageGroups["55+"]++
        }
      })

      // Location distribution
      const locations = {}
      attendees.forEach((attendee) => {
        if (attendee.location) {
          locations[attendee.location] = (locations[attendee.location] || 0) + 1
        }
      })

      return {
        totalAttendees: attendees.length,
        ageDistribution: ageGroups,
        locationDistribution: locations,
      }
    })
  }

  async getSalesTimeline(eventId: string, period: "day" | "week" | "month" = "day") {
    const cacheKey = `event:${eventId}:sales:timeline:${period}`
    return this.getCachedOrFetch(cacheKey, 60, async () => {
      const now = new Date()
      let startDate: Date

      switch (period) {
        case "day":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 1)
          break
        case "week":
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate = new Date(now)
          startDate.setMonth(now.getMonth() - 1)
          break
      }

      const tickets = await this.ticketRepository.find({
        where: {
          event: { id: eventId },
          purchaseDate: Between(startDate, now),
        },
        relations: ["ticketTier"],
        order: { purchaseDate: "ASC" },
      })

      // Group by time intervals
      const timelineData = {}

      tickets.forEach((ticket) => {
        let timeKey: string
        const purchaseDate = new Date(ticket.purchaseDate)

        if (period === "day") {
          // Group by hour
          timeKey = purchaseDate.toISOString().slice(0, 13) + ":00"
        } else if (period === "week") {
          // Group by day
          timeKey = purchaseDate.toISOString().slice(0, 10)
        } else {
          // Group by day for month view too
          timeKey = purchaseDate.toISOString().slice(0, 10)
        }

        if (!timelineData[timeKey]) {
          timelineData[timeKey] = {
            count: 0,
            revenue: 0,
          }
        }

        timelineData[timeKey].count += 1
        timelineData[timeKey].revenue += Number(ticket.ticketTier.price)
      })

      // Convert to array for easier consumption by charts
      return Object.entries(timelineData).map(([time, data]) => ({
        time,
        ...(data as { count: number; revenue: number }),
      }))
    })
  }

  async notifySalesUpdate(eventId: string, data: any) {
    await this.redisService.publish(`event:${eventId}:sales:update`, data)

    // Invalidate caches
    const cacheKeys = [
      `event:${eventId}:sales:overview`,
      `event:${eventId}:revenue:breakdown`,
      `event:${eventId}:sales:timeline:day`,
      `event:${eventId}:sales:timeline:week`,
      `event:${eventId}:sales:timeline:month`,
    ]

    for (const key of cacheKeys) {
      await this.redisService.set(key, null, 1) // Expire immediately
    }
  }
}

