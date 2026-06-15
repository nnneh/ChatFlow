import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

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
  socketId: {
    type: String
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // },
       avatar: {
        type: String,  
      },
      Online: {
        type: Boolean,
        default: false
      },
      refreshToken: {
        type: String,
        default: null
      },
},{timestamps: true})

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


// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; 
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error; 
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
 

// Generate short-lived access token (15 min)
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};
 
// Generate long-lived refresh token (7 days)
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

const User = mongoose.model('User', UserSchema);
export default User;