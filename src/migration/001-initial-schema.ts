import mongoose from 'mongoose';

export async function migrate001() {
  try {
    // Example: Add a new field to an existing collection
    await mongoose.connection.db
      .collection('users')
      .updateMany({}, { $set: { newField: 'default value' } });
    console.log('Migration 001 completed');
  } catch (error) {
    console.error('Migration 001 failed', error);
  }
}
