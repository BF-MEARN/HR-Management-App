import express from 'express';

import {
  getDocument,
  uploadOnboardingDocument,
} from '../controllers/EmployeeDocumentController.js';

const router = express.Router();

router.put('/upload', uploadOnboardingDocument);
router.get('/file', getDocument);

export default router;
