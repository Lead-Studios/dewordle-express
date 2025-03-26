import User from "../models/user.model";

export const migrate002 = async () => {
  try {
    // Example: Add a new field to all existing users
    await User.updateMany({}, { $set: { newField: 'default value' } });
    console.log('Migration 002 completed successfully');
  } catch (error) {
    console.error('Migration 002 failed', error);
    throw error;
  }
};
