import { IsNotEmpty, IsString } from "class-validator"

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  eventId: string

  @IsNotEmpty()
  @IsString()
  ticketTierId: string

  @IsNotEmpty()
  @IsString()
  attendeeId: string
}

