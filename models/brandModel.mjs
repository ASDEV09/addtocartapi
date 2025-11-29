import mongoose from 'mongoose';
const { Schema } = mongoose;

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true }, // Brand name, e.g., "Apple"
  description: { type: String },                        // Optional description
  logo: { type: String },                                // Optional brand logo URL
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Brand', brandSchema);
