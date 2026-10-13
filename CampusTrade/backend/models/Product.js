import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
      default: 'Good'
    },
    location: { type: String, required: true, default: 'Campus' },
    price: { type: Number, required: false },
    rentHourly: { type: Number, required: false },
    rentDaily: { type: Number, required: false },
    availability: {
      type: String,
      required: true,
      enum: ['Sell', 'Rent', 'Both'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented'],
      default: 'available',
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
