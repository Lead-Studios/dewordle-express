import mongoose from "mongoose"
import User from "../../models/user.model"
import Activity, { ActivityType } from "../../models/activity.model"
import type {
  IFollowData,
  IFollowersResponse,
  IFollowingResponse,
  IRecommendedUsersResponse,
} from "../../interfaces/follow.interface"
import Follow from "../../models/follow.models"

class FollowService {
  /**
   * Follow a user
   */
  static async followUser(followData: IFollowData): Promise<boolean> {
    try {
      // Check if users exist
      const followerExists = await User.findById(followData.follower)
      const followingExists = await User.findById(followData.following)

      if (!followerExists || !followingExists) {
        throw new Error("One or both users do not exist")
      }

      // Check if already following
      const existingFollow = await Follow.findOne({
        follower: followData.follower,
        following: followData.following,
      })

      if (existingFollow) {
        return false // Already following
      }

      // Create follow relationship
      const follow = new Follow({
        follower: followData.follower,
        following: followData.following,
      })

      await follow.save()

      // Create activity for this follow action
      await Activity.create({
        user: followData.follower,
        type: ActivityType.FOLLOW,
        targetUser: followData.following,
        createdAt: new Date(),
      })

      return true
    } catch (error) {
      console.error("Error in followUser service:", error)
      throw error
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(followData: IFollowData): Promise<boolean> {
    try {
      const result = await Follow.findOneAndDelete({
        follower: followData.follower,
        following: followData.following,
      })

      return !!result // Return true if something was deleted, false otherwise
    } catch (error) {
      console.error("Error in unfollowUser service:", error)
      throw error
    }
  }

  /**
   * Get followers of a user
   */
  static async getFollowers(userId: string, page = 1, limit = 20): Promise<IFollowersResponse> {
    try {
      const skip = (page - 1) * limit

      const followers = await Follow.find({ following: userId })
        .populate("follower", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const count = await Follow.countDocuments({ following: userId })

      return {
        followers: followers.map((f) => f.follower),
        count,
      }
    } catch (error) {
      console.error("Error in getFollowers service:", error)
      throw error
    }
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(userId: string, page = 1, limit = 20): Promise<IFollowingResponse> {
    try {
      const skip = (page - 1) * limit

      const following = await Follow.find({ follower: userId })
        .populate("following", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const count = await Follow.countDocuments({ follower: userId })

      return {
        following: following.map((f) => f.following),
        count,
      }
    } catch (error) {
      console.error("Error in getFollowing service:", error)
      throw error
    }
  }

  /**
   * Check if a user is following another user
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const follow = await Follow.findOne({
        follower: followerId,
        following: followingId,
      })

      return !!follow
    } catch (error) {
      console.error("Error in isFollowing service:", error)
      throw error
    }
  }

  /**
   * Get recommended users for a user to follow
   * This implementation suggests users that the user's followings are following
   * but the user is not following yet (friends of friends)
   */
  static async getRecommendedUsers(userId: string, limit = 10): Promise<IRecommendedUsersResponse> {
    try {
      // Get users that the current user is following
      const following = await Follow.find({ follower: userId }).select("following")
      const followingIds = following.map((f) => f.following)

      // Find users that are followed by users that the current user follows
      // but not followed by the current user yet
      const recommendedUsers = await Follow.aggregate([
        // Find users followed by people the current user follows
        { $match: { follower: { $in: followingIds } } },
        // Exclude the current user and users already followed
        {
          $match: {
            following: {
              $ne: new mongoose.Types.ObjectId(userId),
              $nin: followingIds,
            },
          },
        },
        // Group by the recommended user and count how many connections follow them
        {
          $group: {
            _id: "$following",
            score: { $sum: 1 },
          },
        },
        // Sort by score (number of mutual connections)
        { $sort: { score: -1 } },
        { $limit: limit },
        // Lookup user details
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        // Unwind the user details array
        { $unwind: "$userDetails" },
        // Project only needed fields
        {
          $project: {
            _id: 1,
            username: "$userDetails.username",
            email: "$userDetails.email",
            score: 1,
          },
        },
      ])

      // If we don't have enough recommendations, add some random users
      if (recommendedUsers.length < limit) {
        const additionalCount = limit - recommendedUsers.length
        const existingIds = [...followingIds, userId, ...recommendedUsers.map((u) => u._id)]

        const randomUsers = await User.aggregate([
          { $match: { _id: { $nin: existingIds.map((id) => new mongoose.Types.ObjectId(id.toString())) } } },
          { $sample: { size: additionalCount } },
          { $project: { _id: 1, username: 1, email: 1 } },
        ])

        recommendedUsers.push(...randomUsers.map((u) => ({ ...u, score: 0 })))
      }

      return { users: recommendedUsers }
    } catch (error) {
      console.error("Error in getRecommendedUsers service:", error)
      throw error
    }
  }
}

export default FollowService

