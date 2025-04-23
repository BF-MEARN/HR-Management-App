import express from 'express';

import {
  editAddress,
  editContactInfo,
  editDocuments,
  editEmail,
  editEmergencyContact,
  editEmployment,
  editName,
  getDocumentUrl,
  getPersonalInfo,
} from '../controllers/PersonalInfoController.js';

const router = express.Router();

router.get('/', getPersonalInfo);
router.get('/document-url', getDocumentUrl);

router.put('/name', editName);
router.put('/address', editAddress);
router.put('/contact-info', editContactInfo);
router.put('/employment', editEmployment);
router.put('/emergency-contact', editEmergencyContact);
router.put('/documents', editDocuments);
router.put('/email', editEmail);

export default router;
