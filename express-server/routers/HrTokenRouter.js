import express from 'express';

import { generateToken, getTokenHistory } from '../controllers/HrTokenController.js';

const router = express.Router();

/**
 * @desc    Generate a registration token and send email invite
 * @route   POST /api/hr/token/generate
 */
router.post('/generate', generateToken);

/**
 * @desc    Get all registration tokens with expiry and usage info
 * @route   GET /api/hr/token/history
 */
router.get('/history', getTokenHistory);

export default router;
