// import User from '../models/User.js'
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import emailjs from "@emailjs/browser";

// export const generateRegistrationToken = async (req, res) => {
//   try {
//     const { newUserEmail, hrId } = req.body;

//     //check if the HR id is valid

//     //send email if valid
//     console.log("hello");

//     console.log("key test", process.env.EMAILJS_PUBLIC_KEY);
//     console.log("service test", process.env.EMAILJS_SERVICE_ID);
//     console.log("template test", process.env.EMAILJS_TEMPLATE_ID);
//     //link here should be a route to the registration page and should include the HR users ID (or other data for verifying)
//     const emailStatus = await emailjs.send(
//       process.env.EMAILJS_SERVICE_ID!,
//       process.env.EMAILJS_TEMPLATE_ID!,
//       {
//         link: `http://localhost:3000/registration/${hrId}`,
//         email: newUserEmail,
//       },
//       process.env.EMAILJS_PUBLIC_KEY!
//     );

//     console.log("email status", emailStatus);

//     return res.status(200).json({
//       message: "Email sent successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error sending email",
//       error: error,
//     });
//   }
// };

