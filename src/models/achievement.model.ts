import { Schema, model, Document } from "mongoose";
export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  requirements: string;
  points: number;
  category: string;
  rarity: string;
}
const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    requirements: { type: String, required: true },
    points: { type: Number, default: 0 },
    category: { type: String, default: "Beginner" },
    rarity: { type: String, default: "Common" }
  },
  { timestamps: true }
);
export const Achievement = model<IAchievement>("Achievement", achievementSchema);
