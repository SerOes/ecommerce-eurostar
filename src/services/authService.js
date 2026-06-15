import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123_safe';

export const authService = {
  register: async (userData) => {
    const { email, password, name } = userData;

    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const newUser = UserModel.create({ email, password, name });
    
    // Do not return sensitive info like password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
};
