import express from 'express';

import { uploadOnboardingDocument } from '../controllers/EmployeeDocumentController.js';

const router = express.Router();

router.put('/upload', uploadOnboardingDocument);

export default router;
