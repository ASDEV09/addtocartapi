import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },            // Original price
  stock: { type: Number, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },
thumbnail: { type: String, required: true },

  images: [{ type: String }],                        // Array of image URLs

  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }, // ✅ NEW FIELD

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
