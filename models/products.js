import mongoose from "mongoose";

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  amount: {
    type: String,
    require: true,
  },
  brand: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Product", productsSchema);