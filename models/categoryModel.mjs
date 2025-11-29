import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true }, // Category name, e.g., "Electronics"
  description: { type: String },                         // Optional description
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categorySchema);
