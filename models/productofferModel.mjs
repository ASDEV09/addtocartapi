import mongoose from 'mongoose';
const { Schema } = mongoose;

const productOfferSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  offer_id: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
  
  discountPercentage: { type: Number },       // optional
  discountPrice: { type: Number },            // optional, manually set price
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ProductOffer', productOfferSchema);
