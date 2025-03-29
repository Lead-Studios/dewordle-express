import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Event } from "./entities/event.entity"
import { Ticket } from "./entities/ticket.entity"
import { TicketTier } from "./entities/ticket-tier.entity"
import { Attendee } from "./entities/attendee.entity"
import type { CreateEventDto } from "./dto/create-event.dto"
import type { CreateTicketTierDto } from "./dto/create-ticket-tier.dto"
import type { CreateTicketDto } from "./dto/create-ticket.dto"
import type { CreateAttendeeDto } from "./dto/create-attendee.dto"

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketTier)
    private ticketTierRepository: Repository<TicketTier>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto)
    return this.eventRepository.save(event)
  }

  async findAllEvents(): Promise<Event[]> {
    return this.eventRepository.find()
  }

  async findEventById(id: string): Promise<Event> {
    return this.eventRepository.findOne({
      where: { id },
      relations: ["tickets", "attendees"],
    })
  }

  async createTicketTier(createTicketTierDto: CreateTicketTierDto): Promise<TicketTier> {
    const { eventId, ...tierData } = createTicketTierDto

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const ticketTier = this.ticketTierRepository.create({
      ...tierData,
      event,
    })

    return this.ticketTierRepository.save(ticketTier)
  }

  async findTicketTiersByEventId(eventId: string): Promise<TicketTier[]> {
    return this.ticketTierRepository.find({
      where: { event: { id: eventId } },
    })
  }

  async createAttendee(createAttendeeDto: CreateAttendeeDto): Promise<Attendee> {
    const { eventId, ...attendeeData } = createAttendeeDto

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const attendee = this.attendeeRepository.create({
      ...attendeeData,
      event,
    })

    return this.attendeeRepository.save(attendee)
  }

  async createTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { eventId, ticketTierId, attendeeId } = createTicketDto

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    })

    if (!event) {
      throw new Error("Event not found")
    }

    const ticketTier = await this.ticketTierRepository.findOne({
      where: { id: ticketTierId },
    })

    if (!ticketTier) {
      throw new Error("Ticket tier not found")
    }

    const attendee = await this.attendeeRepository.findOne({
      where: { id: attendeeId },
    })

    if (!attendee) {
      throw new Error("Attendee not found")
    }

    // Generate a unique ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const ticket = this.ticketRepository.create({
      ticketNumber,
      event,
      ticketTier,
      attendee,
    })

    // Update the sold count for the ticket tier
    ticketTier.sold += 1
    await this.ticketTierRepository.save(ticketTier)

    return this.ticketRepository.save(ticket)
  }

  async findTicketsByEventId(eventId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { event: { id: eventId } },
      relations: ["ticketTier", "attendee"],
    })
  }
}

