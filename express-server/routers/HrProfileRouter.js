import express from 'express';

import { getAllProfiles, getProfileById } from '../controllers/HrProfileController.js';

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/:id', getProfileById);

export default router;
