import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AnalyticsController } from "./analytics.controller"
import { AnalyticsService } from "./analytics.service"
import { AnalyticsGateway } from "./analytics.gateway"
import { Event } from "../events/entities/event.entity"
import { Ticket } from "../events/entities/ticket.entity"
import { TicketTier } from "../events/entities/ticket-tier.entity"
import { Attendee } from "../events/entities/attendee.entity"
import { RedisModule } from "../redis/redis.module"

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket, TicketTier, Attendee]), RedisModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsGateway],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

