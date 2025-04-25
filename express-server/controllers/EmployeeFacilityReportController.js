import Employee from '../models/Employee.js';
import FacilityReport from '../models/FacilityReport.js';
import User from '../models/User.js';

/**
 * Helper Function
 */
const thisReportWasNotCreatedByUser = async (req, facilityReport) => {
  const { id: userId } = req.user;
  const findEmployeeByUserId = await Employee.findOne({ userId }).select('_id');
  const { _id: employeeId } = findEmployeeByUserId;
  return employeeId.toString() !== facilityReport.employeeId.toString();
};

/**
 * @desc    Find all facility reports submitted by the current user for a specific house
 * @route   GET /api/employee/facilityReport/house/:houseId
 * @access  Employee only
 */
export const getCurrentUserFacilityReportsByHouseId = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    }).select('_id');
    const { _id: employeeId } = findEmployeeByUserId;

    const facilityReports = await FacilityReport.find({
      houseId,
      employeeId,
    })
      .select('title description status comments')
      .populate({
        path: 'comments.createdBy',
        select: 'employeeId -_id',
        populate: {
          path: 'employeeId',
          select: 'preferredName firstName middleName lastName -_id',
        },
      });

    res.status(200).json(facilityReports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to find the facility reports', error: error.message });
  }
};

/**
 * @desc    Create a facility report for a specific house
 * @route   POST /api/employee/facilityReport/house/:houseId/create
 * @access  Employee only
 */
export const createFacilityReport = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { title, description } = req.body;
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    }).select('_id houseId');
    const { _id: employeeId, houseId: employeeHouseId } = findEmployeeByUserId;

    if (houseId !== employeeHouseId.toString()) {
      return res.status(403).json({
        message:
          'Employee does NOT reside in this house. Hence, they CANNOT write a facility report of this house!',
      });
    }

    const newFacilityReport = new FacilityReport({
      employeeId,
      houseId,
      title,
      description,
      comments: [],
    });
    await newFacilityReport.save();

    res.status(201).json({
      message: 'Facility Report successfully created!',
      facility_report: newFacilityReport,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create a Facility Report!', error: error.message });
  }
};

/**
 * @desc    Update the facility report
 * @route   PUT /api/employee/facilityReport/:facilityReportId/update
 * @access  Employee only
 */
export const updateFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;
    const { newTitle, newDescription } = req.body;

    const facilityReport = await FacilityReport.findById(facilityReportId).select(
      'title description employeeId status createdAt updatedAt'
    );
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message: 'This employee did NOT create this facility report! Hence, they CANNOT edit it!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }

    const { title: oldTitle, description: oldDescription } = facilityReport;
    facilityReport.title = newTitle;
    facilityReport.description = newDescription;
    await facilityReport.save();

    res.status(200).json({
      message: 'Facility Report successfully updated',
      oldTitle,
      oldDescription,
      newTitle,
      newDescription,
      facilityReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update the Facility Report!', error: error.message });
  }
};

/**
 * @desc    Close the current facility report
 * @route   PATCH /api/employee/facilityReport/:facilityReportId/close
 * @access  Employee only
 */
export const closeFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;

    const facilityReport =
      await FacilityReport.findById(facilityReportId).select('employeeId status');
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message: 'This employee did NOT create this facility report! Hence, they CANNOT close it!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }

    facilityReport.status = 'Closed';
    await facilityReport.save();

    res.status(200).json({ message: 'Successfully closed the facility report' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to close the facility report!', error: error.message });
  }
};

/**
 * @desc    Delete the facility report
 * @route   DELETE /api/employee/facilityReport/:facilityReportId/delete
 * @access  Employee only
 */
export const deleteFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;
    const facilityReport =
      await FacilityReport.findById(facilityReportId).select('employeeId status');
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message: 'This employee did NOT create this facility report! Hence, they CANNOT delete it!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }
    await FacilityReport.findByIdAndDelete(facilityReportId);

    res.status(200).json({ message: 'Facility Report successfully deleted', facilityReport });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete the Facility Report!', error: error.message });
  }
};

/**
 * @desc    Comment on their facility report
 * @route   POST /api/employee/facilityReport/:facilityReportId/comments
 * @access  Employee only
 */
export const addCommentOnFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;
    const facilityReport = await FacilityReport.findById(facilityReportId).select(
      'employeeId status comments'
    );
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message:
          'This employee did NOT create this facility report! Hence, they CANNOT view the report and as a result, they should NOT be able to comment on it!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }

    const { employeeId } = facilityReport;
    const { commentDescription } = req.body;
    const newComment = {
      createdBy: employeeId,
      description: commentDescription,
      timestamp: new Date(),
    };

    facilityReport.comments.push(newComment);
    facilityReport.status = 'In Progress';
    await facilityReport.save();

    res.status(200).json({
      message: 'Successfully added a comment on the Facility Report!',
      facilityReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to add a comment on the Facility Report!', error: error.message });
  }
};

/**
 * @desc    Update comment on the facility report
 * @route   PUT /api/employee/facilityReport/:facilityReportId/comments/:commentId
 * @access  Employee only
 */
export const updateCommentOnFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;
    const facilityReport = await FacilityReport.findById(facilityReportId).select(
      'employeeId comments status'
    );
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message:
          'This employee did NOT create this facility report! Hence, they CANNOT view the report and as a result, they should NOT be able to update any comments there!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }

    const { commentId } = req.params;
    const existingComment = facilityReport.comments.find((comment) => {
      return comment._id.toString() === commentId;
    });
    if (!existingComment) {
      return res.status(400).json({
        message: 'Comment NOT found!',
      });
    }

    const { employeeId } = facilityReport;
    if (employeeId.toString() !== existingComment.createdBy.toString()) {
      return res.status(403).json({
        message: 'This employee did NOT create this comment! Hence, they CANNOT edit it!',
      });
    }

    const { description: oldDescription } = existingComment;
    const { newDescription } = req.body;
    existingComment.description = newDescription;
    await facilityReport.save();

    res.status(200).json({
      message: 'Successfully updated the comment',
      oldDescription,
      newDescription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update the comment', error: error.message });
  }
};

/**
 * @desc    Remove comment from facility report
 * @route   DELETE /api/employee/facilityReport/:facilityReportId/comments/:commentId/delete
 * @access  Employee only
 */
export const deleteCommentFromFacilityReport = async (req, res) => {
  try {
    const { facilityReportId } = req.params;
    const facilityReport = await FacilityReport.findById(facilityReportId).select(
      'employeeId comments status'
    );
    if (await thisReportWasNotCreatedByUser(req, facilityReport)) {
      return res.status(403).json({
        message:
          'This employee did NOT create this facility report! Hence, they CANNOT view the report and as a result, they should NOT be able to delete any comments there!',
      });
    }
    if (facilityReport.status === 'Closed') {
      return res.status(400).json({
        message: 'This Facility Report is already closed!',
      });
    }

    const { commentId } = req.params;
    const existingComment = facilityReport.comments.find((comment) => {
      return comment._id.toString() === commentId;
    });
    if (!existingComment) {
      return res.status(400).json({
        message: 'Comment NOT found!',
      });
    }

    const { employeeId } = facilityReport;
    if (employeeId.toString() !== existingComment.createdBy.toString()) {
      return res.status(403).json({
        message: 'This employee did NOT create this comment! Hence, they CANNOT delete it!',
      });
    }

    facilityReport.comments = facilityReport.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await facilityReport.save();
    res.status(200).json({ message: 'Comment successfully deleted!', existingComment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment!', error: error.message });
  }
};
