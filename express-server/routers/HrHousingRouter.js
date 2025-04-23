import express from 'express';

import {
  addComment,
  createHouse,
  deleteHouse,
  getAllHouses,
  getFacilityReportsByHouseId,
  getResidentsByHouseId,
  updateComment,
} from '../controllers/HrHousingController.js';

const router = express.Router();

router.get('/', getAllHouses);
router.post('/', createHouse);
router.delete('/:id', deleteHouse);
router.get('/:id/residents', getResidentsByHouseId);
router.get('/:id/reports', getFacilityReportsByHouseId);
router.post('/report/:reportId/comments', addComment);
router.put('/report/:reportId/comments/:commentId', updateComment);

export default router;
