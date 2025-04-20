import express from 'express';

import { generateToken, getTokenHistory } from '../controllers/TokenController.js';

const router = express.Router();

router.post('/generate', generateToken);
router.get('/history', getTokenHistory);

export default router;
