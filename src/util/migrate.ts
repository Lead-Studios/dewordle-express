import mongoose from 'mongoose';
// import { migrate001 } from '../migrations/001-initial-schema';
// import { migrate002 } from '../migrations/002-add-user-fields';

export async function runMigrations() {
  try {
    // Run migrations in sequence
    await migrate001();
    await migrate002();
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed', error);
  }
}

// Call in your main application setup
// import { connectDB } from '../config/database';
// import { runMigrations } from './utils/migrate';
import { migrate001 } from '../migration/001-initial-schema';
import connectDB from '../config/database';
import { migrate002 } from '../migration/002-add.user.field';

async function bootstrap() {
  await connectDB();
  await runMigrations();
}
