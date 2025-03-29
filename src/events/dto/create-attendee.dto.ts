import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator"

export class CreateAttendeeDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsNumber()
  age?: number

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsObject()
  demographics?: Record<string, any>

  @IsNotEmpty()
  @IsString()
  eventId: string
}

