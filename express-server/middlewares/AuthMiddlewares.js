import jwt from 'jsonwebtoken';
import validator from 'validator';

export const userAuth = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized (No Token)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded !== 'object' || !decoded.id || !validator.isMongoId(decoded.id)) {
      return res.status(401).json({ message: 'Unauthorized (Invalid Token)' });
    }
  } catch (error) {
    return res.status(401).json(error);
  }

  next();
};
