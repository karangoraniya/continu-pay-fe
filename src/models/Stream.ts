import mongoose from "mongoose";

export interface IStream {
  streamId: number;
  tokenAddress: string;
  sender: string;
  recipient: string;
  deposit: string;
  startTime: Date;
  stopTime: Date;
  isRecurring: boolean;
  recurringPeriod: number;
}

const StreamSchema = new mongoose.Schema<IStream>({
  streamId: { type: Number, required: true },
  tokenAddress: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  deposit: { type: String, required: true },
  startTime: { type: Date, required: true },
  stopTime: { type: Date, required: true },
  isRecurring: { type: Boolean, required: true },
  recurringPeriod: { type: Number, required: true },
});

export default mongoose.models.Stream ||
  mongoose.model<IStream>("Stream", StreamSchema);
