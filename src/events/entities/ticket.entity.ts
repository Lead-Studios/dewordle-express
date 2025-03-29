import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { TicketTier } from "./ticket-tier.entity"
import { Attendee } from "./attendee.entity"

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  ticketNumber: string

  @Column({ default: false })
  isUsed: boolean

  @CreateDateColumn()
  purchaseDate: Date

  @ManyToOne(
    () => Event,
    (event) => event.tickets,
  )
  event: Event

  @ManyToOne(
    () => TicketTier,
    (ticketTier) => ticketTier.tickets,
  )
  ticketTier: TicketTier

  @ManyToOne(
    () => Attendee,
    (attendee) => attendee.tickets,
  )
  attendee: Attendee
}

