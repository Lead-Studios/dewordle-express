import type { ActivityType } from "../models/activity.model"

export interface IActivityData {
  user: string
  type: ActivityType
  targetUser?: string
  targetContent?: string
  contentType?: string
  data?: any
}

export interface IActivityFeedOptions {
  limit?: number
  cursor?: string
  userId: string
}

