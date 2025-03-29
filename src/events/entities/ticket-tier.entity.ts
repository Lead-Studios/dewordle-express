import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { Ticket } from "./ticket.entity"

@Entity()
export class TicketTier {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string // e.g., VIP, General, Early Bird

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number

  @Column()
  quantity: number

  @Column({ default: 0 })
  sold: number

  @ManyToOne(() => Event)
  event: Event

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.ticketTier,
  )
  tickets: Ticket[]
}

