import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  age: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
});

export default mongoose.model("User", userSchema);