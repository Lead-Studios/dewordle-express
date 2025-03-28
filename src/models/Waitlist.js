import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  userEmail: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false },
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);
export default Waitlist;