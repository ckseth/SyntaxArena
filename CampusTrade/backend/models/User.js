import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hash = await bcrypt.hash(this.password, salt);
    // Replace password with hash
    this.password = hash;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (passwordToCheck) {
  try {
    const isMatch = await bcrypt.compare(passwordToCheck, this.password);
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);
export default User;
