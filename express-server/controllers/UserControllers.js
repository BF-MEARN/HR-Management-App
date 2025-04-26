import bcrypt from 'bcryptjs';

import RegistrationToken from '../models/RegistrationToken.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const saltRounds = 10;

/**
 * @desc    Log in user and set authToken cookie
 * @route   POST /api/user/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'invalid password' });
    }

    const authToken = generateToken(user._id);

    res.cookie('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'server error', error });
  }
};

/**
 * @desc    Clear authToken cookie and log out
 * @route   POST /api/user/logout
 * @access  Authenticated users
 */
export const logout = async (req, res) => {
  res.clearCookie('authToken').json({ message: 'Logged out successfully' });
};

/**
 * @desc    Validate if the given registration token is valid
 * @route   get /api/user/registration-token/:tokenUUID
 * @access  Authenticated users
 */
export const validateRegistrationToken = async (req, res) => {
  try {
    const { tokenUUID } = req.params;

    // not expired, not used
    const token = await RegistrationToken.findOne({
      token: tokenUUID,
      expiresAt: { $gt: new Date() },
      used: false,
    });
    if (!token) {
      return res.status(404).json({ message: 'Registration token not found or invalid.' });
    }
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate employee registration token ', error });
  }
};

/**
 * @desc    Register a new user (defaults to employee role)
 * @route   POST /api/user/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { username, password, email, tokenUUID } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: `Missing username or password or email.` });
    }
    if (!tokenUUID) {
      return res.status(400).json({ error: `Missing registration token.` });
    }
    const token = await RegistrationToken.findOne({
      token: tokenUUID,
      email,
      expiresAt: { $gt: new Date() },
      used: false,
    });
    if (!token) {
      return res.status(400).json({ message: 'Registration token is not valid' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already registered.' });
      } else {
        return res.status(400).json({ message: 'Email already registered.' });
      }
    }

    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const newUser = new User({
      username,
      password: passwordHash,
      email,
      role: 'employee',
    });

    token.used = true;
    await Promise.all([token.save(), newUser.save()]);
    res.status(201).json({ message: `Registration successful!` });
  } catch (error) {
    console.error({ error: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({ user });
};
