import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "sub-admin" | "user";
  achievements: Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}
