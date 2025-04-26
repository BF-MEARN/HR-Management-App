import jwt from 'jsonwebtoken';
import validator from 'validator';

import User from '../models/User.js';

export const userAuth = async (req, res, next) => {
  const token = req.cookies.hrAuthToken || req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized (No Token)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded.id || !validator.isMongoId(decoded.id)) {
      return res.status(401).json({ message: 'Unauthorized (Invalid Token)' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized (Token Error)', error: error.message });
  }
};

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== role) {
        return res.status(403).json({ message: `Forbidden: ${role} access only` });
      }

      req.currentUser = user; // for convenience in downstream routes
      next();
    } catch (err) {
      res.status(500).json({ message: 'Role check failed', error: err.message });
    }
  };
};

// Shortcuts for specific roles
export const requireHR = requireRole('hr');
export const requireEmployee = requireRole('employee');

export const employeeAuth = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized (No Employee Token)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded.id || !validator.isMongoId(decoded.id)) {
      return res.status(401).json({ message: 'Unauthorized (Invalid Employee Token)' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized (Employee Token Error)', error: error.message });
  }
};

export const hrAuth = async (req, res, next) => {
  const token = req.cookies.hrAuthToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized (No HR Token)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded.id || !validator.isMongoId(decoded.id)) {
      return res.status(401).json({ message: 'Unauthorized (Invalid HR Token)' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized (HR Token Error)', error: error.message });
  }
};
