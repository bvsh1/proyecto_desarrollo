import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});

const User = mongoose.model('User', userSchema);

export default User;

