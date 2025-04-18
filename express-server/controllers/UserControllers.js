import User from '../models/User.js'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js'

export const login = async (req, res) => {
  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "invalid username" })
    }

    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({ message: "invalid password" })
    }

    const token = generateToken(user._id);

    res.cookie("token", token)

    res.status(200).json({ message: "login successful", user })
  } catch (error) {
    res.status(500).json({ message: "server error", error })
  }
}

export const logout = async (req, res) => {
  res.cookie("token", "")
  res.json({ message: "Logged out successfully" })
}
