import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3h' })
}

export const generateTokenWithFullUser = (user) => {
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            isCreated: user.isCreated,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '3h'
        }
    )

    return token;
}
