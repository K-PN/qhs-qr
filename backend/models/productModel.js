import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    serial: { type: String },
    model: { type: String },
    time: { type: String, required: true },
    sDay: { type: String },
    eDay: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
