// src/models/follow.model.ts
import mongoose, { Schema, type Model, type Document } from "mongoose"

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId
  following: mongoose.Types.ObjectId
  createdAt: Date
}

const followSchema: Schema = new Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Create a compound index to ensure a user can only follow another user once
followSchema.index({ follower: 1, following: 1 }, { unique: true })

const Follow: Model<IFollow> = mongoose.model<IFollow>("Follow", followSchema)

export default Follow

