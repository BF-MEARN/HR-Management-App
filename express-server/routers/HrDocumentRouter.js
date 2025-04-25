import express from 'express';

import { downloadDocument, getDocument } from '../controllers/HrDocumentController.js';

const router = express.Router();

router.get('/file', getDocument);
router.get('/download', downloadDocument);

export default router;
