import { Controller, Get, Param, Query, Res } from "@nestjs/common"
import type { Response } from "express"
import type { AnalyticsService } from "./analytics.service"

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('events/:eventId/sales/overview')
  async getEventSalesOverview(@Param('eventId') eventId: string) {
    return this.analyticsService.getEventSalesOverview(eventId);
  }

  @Get('events/:eventId/revenue/breakdown')
  async getRevenueBreakdown(@Param('eventId') eventId: string) {
    return this.analyticsService.getRevenueBreakdown(eventId);
  }

  @Get('events/:eventId/attendees/demographics')
  async getAttendeeDemographics(@Param('eventId') eventId: string) {
    return this.analyticsService.getAttendeeDemographics(eventId);
  }

  @Get("events/:eventId/sales/timeline")
  async getSalesTimeline(@Param('eventId') eventId: string, @Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.analyticsService.getSalesTimeline(eventId, period)
  }

  @Get("events/:eventId/export/csv")
  async exportCsv(@Param('eventId') eventId: string, @Res() res: Response) {
    const overview = await this.analyticsService.getEventSalesOverview(eventId)
    const breakdown = await this.analyticsService.getRevenueBreakdown(eventId)

    let csv = "Category,Metric,Value\n"
    csv += `Overview,Total Tickets,${overview.totalTickets}\n`
    csv += `Overview,Sold Tickets,${overview.soldTickets}\n`
    csv += `Overview,Remaining Tickets,${overview.remainingTickets}\n`
    csv += `Overview,Total Revenue,${overview.totalRevenue}\n`
    csv += `Overview,Percentage Sold,${overview.percentageSold.toFixed(2)}%\n\n`

    csv += "Tier,Tickets Sold,Price Per Ticket,Revenue\n"
    breakdown.forEach((tier) => {
      csv += `${tier.tierName},${tier.ticketsSold},${tier.pricePerTicket},${tier.revenue}\n`
    })

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="event-${eventId}-analytics.csv"`)
    return res.send(csv)
  }

  @Get("events/:eventId/export/pdf")
  async exportPdf(@Param('eventId') eventId: string, @Res() res: Response) {
    // In a real implementation, you would use a library like PDFKit to generate a PDF
    // For this example, we'll just return a message
    res.setHeader("Content-Type", "application/json")
    return res.json({
      message: "PDF generation would be implemented here with a library like PDFKit",
      note: "This would include formatted tables and charts from the analytics data",
    })
  }
}

