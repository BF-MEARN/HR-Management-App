import express from 'express';

import {
  approveVisaDocument,
  getAllVisaStatuses,
  getInProgressVisaStatuses,
  getVisaStatusById,
  notifyEmployeeForNextStep,
  rejectVisaDocument,
} from '../controllers/HrVisaController.js';

const router = express.Router();

router.get('/in-progress', getInProgressVisaStatuses);
router.get('/all', getAllVisaStatuses);
router.get('/:id', getVisaStatusById);
router.patch('/:id/approve', approveVisaDocument);
router.patch('/:id/reject', rejectVisaDocument);
router.post('/:id/notify', notifyEmployeeForNextStep);

export default router;
