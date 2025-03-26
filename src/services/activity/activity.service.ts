// src/services/activity/activity.service.ts
import mongoose from "mongoose"
import Activity from "../../models/activity.model"
import type { IActivityData, IActivityFeedOptions } from "../../interfaces/activity.interface"
import type { IActivityFeedResponse } from "../../interfaces/follow.interface"
import Follow from "../../models/follow.models"

class ActivityService {
  /**
   * Create a new activity
   */
  static async createActivity(activityData: IActivityData): Promise<any> {
    try {
      const activity = new Activity(activityData)
      return await activity.save()
    } catch (error) {
      console.error("Error in createActivity service:", error)
      throw error
    }
  }

  /**
   * Get activity feed for a user
   * This includes activities from users they follow
   */
  static async getActivityFeed(options: IActivityFeedOptions): Promise<IActivityFeedResponse> {
    try {
      const { userId, limit = 20, cursor } = options

      // Get users that the current user is following
      const following = await Follow.find({ follower: userId }).select("following")
      const followingIds = following.map((f) => f.following)

      // Add the user's own ID to see their activities too
      followingIds.push(new mongoose.Types.ObjectId(userId))

      // Build query
      const query: any = { user: { $in: followingIds } }

      // If cursor is provided, get activities older than the cursor
      if (cursor) {
        const cursorDate = new Date(Number.parseInt(cursor))
        query.createdAt = { $lt: cursorDate }
      }

      // Get activities
      const activities = await Activity.find(query)
        .populate("user", "username email")
        .populate("targetUser", "username email")
        .sort({ createdAt: -1 })
        .limit(limit + 1) // Get one extra to determine if there are more

      // Check if there are more activities
      const hasMore = activities.length > limit
      const resultActivities = hasMore ? activities.slice(0, limit) : activities

      // Get the next cursor if there are more activities
      let nextCursor
      if (hasMore && resultActivities.length > 0) {
        const oldestActivity = resultActivities[resultActivities.length - 1]
        nextCursor = oldestActivity.createdAt.getTime().toString()
      }

      return {
        activities: resultActivities,
        nextCursor,
      }
    } catch (error) {
      console.error("Error in getActivityFeed service:", error)
      throw error
    }
  }

  /**
   * Get activities for a specific user
   */
  static async getUserActivities(userId: string, limit = 20, cursor?: string): Promise<IActivityFeedResponse> {
    try {
      // Build query
      const query: any = { user: userId }

      // If cursor is provided, get activities older than the cursor
      if (cursor) {
        const cursorDate = new Date(Number.parseInt(cursor))
        query.createdAt = { $lt: cursorDate }
      }

      // Get activities
      const activities = await Activity.find(query)
        .populate("user", "username email")
        .populate("targetUser", "username email")
        .sort({ createdAt: -1 })
        .limit(limit + 1) // Get one extra to determine if there are more

      // Check if there are more activities
      const hasMore = activities.length > limit
      const resultActivities = hasMore ? activities.slice(0, limit) : activities

      // Get the next cursor if there are more activities
      let nextCursor
      if (hasMore && resultActivities.length > 0) {
        const oldestActivity = resultActivities[resultActivities.length - 1]
        nextCursor = oldestActivity.createdAt.getTime().toString()
      }

      return {
        activities: resultActivities,
        nextCursor,
      }
    } catch (error) {
      console.error("Error in getUserActivities service:", error)
      throw error
    }
  }
}

export default ActivityService

