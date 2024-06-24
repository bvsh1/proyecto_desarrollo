import mongoose from "mongoose";

const productsSchema = mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  description: String,
  stock: Number,
});

export default mongoose.model("Product", productsSchema);