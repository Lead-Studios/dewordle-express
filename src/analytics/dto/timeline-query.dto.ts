import { IsEnum, IsOptional } from "class-validator"

export enum TimelinePeriod {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

export class TimelineQueryDto {
  @IsOptional()
  @IsEnum(TimelinePeriod)
  period?: TimelinePeriod = TimelinePeriod.DAY
}

