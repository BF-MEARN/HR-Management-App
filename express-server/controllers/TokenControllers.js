import { v4 as uuidv4 } from 'uuid';
import RegistrationToken from '../models/RegistrationToken.js';

export const generateRegistrationToken = async (req, res) => {
	try {
		const { name, email } = req.body;

		const token = uuidv4();
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		const newToken = await RegistrationToken.create({
			name,
			email,
			token,
			expiresAt,
		});

		const registrationLink = `${process.env.FRONTEND_URL}/register/${token}`;

		// TODO: replace with actual sendEmail() logic
		console.log(`Pretend email sent to ${email}: ${registrationLink}`);

		res.status(201).json({
			message: 'Registration token generated and email sent.',
			link: registrationLink,
			token: newToken,
		});
	} catch (err) {
		res.status(500).json({ message: 'Failed to generate token', error: err.message });
	}
};
