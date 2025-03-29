import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import type { EventsService } from "./events.service"
import type { CreateEventDto } from "./dto/create-event.dto"
import type { CreateTicketTierDto } from "./dto/create-ticket-tier.dto"
import type { CreateTicketDto } from "./dto/create-ticket.dto"
import type { CreateAttendeeDto } from "./dto/create-attendee.dto"

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  async findAllEvents() {
    return this.eventsService.findAllEvents()
  }

  @Get(':id')
  async findEventById(@Param('id') id: string) {
    return this.eventsService.findEventById(id);
  }

  @Post(":eventId/ticket-tiers")
  async createTicketTier(@Param('eventId') eventId: string, @Body() createTicketTierDto: CreateTicketTierDto) {
    return this.eventsService.createTicketTier({
      ...createTicketTierDto,
      eventId,
    })
  }

  @Get(':eventId/ticket-tiers')
  async findTicketTiersByEventId(@Param('eventId') eventId: string) {
    return this.eventsService.findTicketTiersByEventId(eventId);
  }

  @Post(":eventId/attendees")
  async createAttendee(@Param('eventId') eventId: string, @Body() createAttendeeDto: CreateAttendeeDto) {
    return this.eventsService.createAttendee({
      ...createAttendeeDto,
      eventId,
    })
  }

  @Post(":eventId/tickets")
  async createTicket(@Param('eventId') eventId: string, @Body() createTicketDto: CreateTicketDto) {
    return this.eventsService.createTicket({
      ...createTicketDto,
      eventId,
    })
  }

  @Get(':eventId/tickets')
  async findTicketsByEventId(@Param('eventId') eventId: string) {
    return this.eventsService.findTicketsByEventId(eventId);
  }
}

