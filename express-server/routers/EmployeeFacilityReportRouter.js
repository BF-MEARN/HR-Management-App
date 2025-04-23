import express from 'express';

import {
  addCommentOnFacilityReport,
  createFacilityReport,
  deleteFacilityReport,
  getCurrentUserFacilityReportsByHouseId,
  updateCommentOnFacilityReport,
  updateFacilityReport,
} from '../controllers/EmployeeFacilityReportController.js';

const router = express.Router();

/**
 * @desc    Get all facility reports submitted by the current user for a specific house
 * @route   GET /api/employee/facilityReport/house/:houseId
 */
router.get('/house/:houseId', getCurrentUserFacilityReportsByHouseId);

/**
 * @desc    Create a facility report for a specific house
 * @route   POST /api/employee/facilityReport/house/:houseId/create
 */
router.post('/house/:houseId/create', createFacilityReport);

/**
 * @desc    Update the facility report
 * @route   PUT /api/employee/facilityReport/:facilityReportId/update
 */
router.put('/:facilityReportId/update', updateFacilityReport);

/**
 * @desc    Delete the facility report
 * @route   DELETE /api/employee/facilityReport/:facilityReportId/delete
 */
router.delete('/:facilityReportId/delete', deleteFacilityReport);

/**
 * @desc    Comment on their facility report
 * @route   POST /api/employee/facilityReport/:facilityReportId/comments
 */
router.post('/:facilityReportId/comments', addCommentOnFacilityReport);

/**
 * @desc    Update comment on the facility report
 * @route   PUT /api/employee/facilityReport/:facilityReportId/comments/:commentId
 */
router.put('/:facilityReportId/comments/:commentId', updateCommentOnFacilityReport);

export default router;
