import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsDateString()
  startDate: string

  @IsNotEmpty()
  @IsDateString()
  endDate: string

  @IsNotEmpty()
  @IsString()
  location: string

  @IsOptional()
  @IsNumber()
  maxAttendees?: number
}

