import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateTicketTierDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number

  @IsNotEmpty()
  @IsString()
  eventId: string
}

