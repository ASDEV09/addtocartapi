import mongoose from 'mongoose';
const { Schema } = mongoose;

const offerSchema = new Schema({
  title: { type: String, required: true },          // e.g., "Winter Mega Sale"
  description: { type: String },                    // optional
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Offer', offerSchema);
