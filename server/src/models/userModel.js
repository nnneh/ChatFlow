import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  online: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

UserSchema.pre('save', async function () {
  // If the password hasn't been modified, just return early to stop execution
  if (!this.isModified('password')) {
    return; 
  }

  try {
    // Hash the password cleanly using await
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    // If something goes wrong with bcrypt, throw the error to pass it to your route's catch block
    throw error; 
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
 
const User = mongoose.model('User', UserSchema);
export default User;