import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Ticket } from "./ticket.entity"
import { Attendee } from "./attendee.entity"

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ type: "timestamp" })
  startDate: Date

  @Column({ type: "timestamp" })
  endDate: Date

  @Column()
  location: string

  @Column({ default: 0 })
  maxAttendees: number

  @OneToMany(
    () => Ticket,
    (ticket) => ticket.event,
  )
  tickets: Ticket[]

  @OneToMany(
    () => Attendee,
    (attendee) => attendee.event,
  )
  attendees: Attendee[]
}

