import mongoose, { Schema } from 'mongoose';
import { GameStatus } from '../enum/gamestatus.enum';

const ResultSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  word: {
    type: String,
    required: true,
    maxlength: 10,
  },
  feedback: {
    type: [String],
    default: [],
  },
  attempts: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  status: {
    type: String,
    enum: Object.values(GameStatus),
    required: true,
  },
  gameDate: {
    type: Date,
    default: Date.now,
  },
});
