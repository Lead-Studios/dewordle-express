import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EventsController } from "./events.controller"
import { EventsService } from "./events.service"
import { Event } from "./entities/event.entity"
import { Ticket } from "./entities/ticket.entity"
import { TicketTier } from "./entities/ticket-tier.entity"
import { Attendee } from "./entities/attendee.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket, TicketTier, Attendee])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

