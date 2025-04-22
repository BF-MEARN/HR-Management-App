import express from 'express';

import { editName, editAddress, editContactInfo, editEmployment, editEmergencyContact, editDocuments, getPersonalInfo } from
  '../controllers/PersonalInfoController.js';

const router = express.Router();

router.get('/', getPersonalInfo);

router.put('/name', editName);
router.put('/address', editAddress);
router.put('/contact-info', editContactInfo);
router.put('/employment', editEmployment);
router.put('/emergency-contact', editEmergencyContact);
router.put('/documents', editDocuments);

export default router;