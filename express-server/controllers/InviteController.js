import { v4 as uuidv4 } from 'uuid';
import RegistrationToken from '../models/RegistrationToken.js';
import { sendEmail } from '../utils/emailService.js';

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
      <h2>Welcome to Beaconfire 🎉</h2>
      <p>Hello ${name},</p>
      <p>Please click the link below to begin your onboarding. This link is valid for 3 hours.</p>
      <a href="${registrationLink}" style="padding: 10px 20px; background-color: #1976d2; color: white; border-radius: 4px; text-decoration: none;">
        Complete Registration
      </a>
      <p>If you didn’t expect this invite, you can ignore it.</p>
    `;

		await sendEmail({
			to: email,
			subject: 'Beaconfire Onboarding Invitation',
			html: emailHTML,
		});

		res.status(201).json({ message: 'Invite sent', token: newToken });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to send invite', error: err.message });
	}
};
