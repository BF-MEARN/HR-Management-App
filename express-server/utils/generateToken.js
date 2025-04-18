import jwt from 'jsonwebtoken';

// interface User {
//     _id: string,
//     username: string,
//     password: string,
//     email: string,
//     role: string,
//     isActive: boolean,
//     isCreated: boolean,
// }

const generateToken = (user) => {
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
        process.env.JWT_SECRET!,
        {
            expiresIn: '3h'
        }
    )

    return token;
}

export default generateToken;