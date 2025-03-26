// src/models/activity.model.ts
import mongoose, { Schema, type Model, type Document } from "mongoose"

export enum ActivityType {
  FOLLOW = "follow",
  POST = "post",
  COMMENT = "comment",
  LIKE = "like",
  ACHIEVEMENT = "achievement",
}

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId
  type: ActivityType
  targetUser?: mongoose.Types.ObjectId
  targetContent?: mongoose.Types.ObjectId
  contentType?: string
  data?: any
  createdAt: Date
}

const activitySchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetContent: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "contentType",
    },
    contentType: {
      type: String,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        return ret
      },
    },
  },
)

// Index for efficient feed generation
activitySchema.index({ user: 1, createdAt: -1 })
activitySchema.index({ targetUser: 1, createdAt: -1 })

const Activity: Model<IActivity> = mongoose.model<IActivity>("Activity", activitySchema)

export default Activity

