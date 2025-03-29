import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class SalesUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string

  @IsNotEmpty()
  @IsUUID()
  ticketId: string

  @IsNotEmpty()
  @IsUUID()
  ticketTierId: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsString()
  ticketNumber: string
}

