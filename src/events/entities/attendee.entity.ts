import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { Ticket } from "./ticket.entity"

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  age: number

  @Column({ nullable: true })
  location: string

  @Column({ type: "jsonb", nullable: true })
  demographics: Record<string, any>

  @ManyToOne(
    () => Event,
    (event) => event.attendees,
  )
  event: Event

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.attendee,
  )
  tickets: Ticket[]
}

