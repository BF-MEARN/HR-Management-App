import express from 'express';

import {
  getDocument,
  getTemplate,
  uploadOnboardingDocument,
} from '../controllers/EmployeeDocumentController.js';

const router = express.Router();

router.put('/upload', uploadOnboardingDocument);
router.get('/file', getDocument);
router.get('/template', getTemplate);

export default router;
