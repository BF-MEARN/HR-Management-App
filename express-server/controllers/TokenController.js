import { v4 as uuidv4 } from 'uuid';

import RegistrationToken from '../models/RegistrationToken.js';
import { sendEmail } from '../utils/emailService.js';

// Generates a unique token and sends an email to the user
export const generateToken = async (req, res) => {
  try {
    const { name, email } = req.body;

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const newToken = await RegistrationToken.create({
      name,
      email,
      token,
      expiresAt,
    });

    const registrationLink = `${process.env.FRONTEND_URL}/register/${token}`;

    const emailHTML = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; display: flex; justify-content: center;">
      <table style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <tr>
          <td style="background-color: #1976d2; padding: 24px; color: #fff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">You're Invited to Join Our Team 🎉</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px;">
            <p style="font-size: 16px; margin-bottom: 16px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 15px; margin-bottom: 24px;">
              We're thrilled to have you start your journey with us! Please click the button below to complete your onboarding process.
              The link is valid for the next <strong>3 hours</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${registrationLink}" target="_blank"
                style="
                  background-color: #1976d2;
                  color: #ffffff;
                  padding: 12px 24px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 6px;
                  display: inline-block;
                ">
                Complete Registration
              </a>
            </div>
            <p style="font-size: 14px; color: #555;">
              If you didn’t expect this email, you can safely ignore it. 
              This invite was sent to <strong>${email}</strong>.
            </p>
            <p style="font-size: 14px; color: #888; margin-top: 32px;">— The HR Team</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} Company HR · All rights reserved
          </td>
        </tr>
      </table>
    </div>
  `;

    await sendEmail({
      to: email,
      subject: 'Onboarding Invitation',
      html: emailHTML,
    });

    res.status(201).json({ message: 'Invite sent', token: newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send invite', error: err.message });
  }
};

// Fetches the token history and enriches it with expiration status
export const getTokenHistory = async (req, res) => {
  try {
    const tokens = await RegistrationToken.find().sort({ createdAt: -1 });

    const now = new Date();

    const enrichedTokens = tokens.map((token) => ({
      name: token.name,
      email: token.email,
      token: token.token,
      used: token.used,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      isExpired: now > token.expiresAt,
    }));

    res.status(200).json(enrichedTokens);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch token history', error: err.message });
  }
};
