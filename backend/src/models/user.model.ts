import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the structure of a User document
const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // No two users can have the same email
  },
  password: { 
    type: String, 
    required: true 
  },
});

// This function runs automatically BEFORE a new user is saved to the database
userSchema.pre('save', async function (next) {
  // If the password hasn't been changed, don't re-hash it
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create and export the User model
export const User = model('User', userSchema);
