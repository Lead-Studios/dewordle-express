
import Waitlist from "../models/Waitlist.js";
import { sendEmail } from "../config/email.js";

// 📌 Join Waitlist
export const joinWaitlist = async (req, res) => {
  const { eventId, userEmail } = req.body;

  if (!eventId || !userEmail) {
    return res.status(400).json({ message: "Event ID and Email are required." });
  }

  const existingEntry = await Waitlist.findOne({ eventId, userEmail });
  if (existingEntry) {
    return res.status(400).json({ message: "You are already on the waitlist." });
  }

  const waitlistEntry = new Waitlist({ eventId, userEmail });
  await waitlistEntry.save();

  res.json({ message: "You have been added to the waitlist." });
};

// 📌 Notify Users When Tickets Are Available
export const notifyWaitlist = async (req, res) => {
  const { eventId } = req.params;
  const availableTickets = req.body.availableTickets || 1;

  const waitlistUsers = await Waitlist.find({ eventId, notified: false })
    .sort({ joinedAt: 1 })
    .limit(availableTickets);

  if (waitlistUsers.length === 0) {
    return res.json({ message: "No users on the waitlist." });
  }

  for (const user of waitlistUsers) {
    await sendEmail(
      user.userEmail,
      "Tickets Available for Your Waitlisted Event!",
      Good news! Tickets for the event you waitlisted are now available. Visit our site to purchase before they’re gone.
    );

    await Waitlist.findByIdAndUpdate(user._id, { notified: true });
  }

  res.json({ message: ${waitlistUsers.length} users notified. });
};