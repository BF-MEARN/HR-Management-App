import express from 'express';

import { generateToken } from '../controllers/InviteController.js';

const router = express.Router();

router.post('/generate', generateToken);

export default router;
