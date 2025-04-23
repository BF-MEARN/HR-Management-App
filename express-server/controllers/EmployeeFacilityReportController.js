import Employee from '../models/Employee.js';
import FacilityReport from '../models/FacilityReport.js';
import Housing from '../models/Housing.js';

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
    });
    const { _id: employeeId } = findEmployeeByUserId;

    const facilityReports = await FacilityReport.find({
      houseId,
      employeeId,
    });

    res.status(200).json(facilityReports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to find the facility reports', error });
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
    });
    const { _id: employeeId } = findEmployeeByUserId;
    const findHouseById = await Housing.findById(houseId);
    if (!findHouseById.residents.includes(employeeId)) {
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
    res.status(500).json({ message: 'Failed to create a Facility Report!', error });
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
    const { title, description } = req.body;
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    });
    const { _id: employeeId } = findEmployeeByUserId;
    const originalFacilityReport = await FacilityReport.findById(facilityReportId);
    if (employeeId.toString() !== originalFacilityReport.employeeId.toString()) {
      return res.status(403).json({
        message: 'This employee did NOT create this facility report! Hence, they CANNOT edit it!',
      });
    }

    const updatedFacilityReport = await FacilityReport.findByIdAndUpdate(
      facilityReportId,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: 'Facility Report successfully updated',
      originalFacilityReport,
      updatedFacilityReport,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update the Facility Report!', error });
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
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    });
    const { _id: employeeId } = findEmployeeByUserId;
    const facilityReport = await FacilityReport.findById(facilityReportId);
    if (employeeId.toString() !== facilityReport.employeeId.toString()) {
      return res.status(403).json({
        message: 'This employee did NOT create this facility report! Hence, they CANNOT delete it!',
      });
    }

    await FacilityReport.findByIdAndDelete(facilityReportId);

    res.status(200).json({ message: 'Facility Report successfully deleted', facilityReport });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete the Facility Report!', error });
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
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    });
    const { _id: employeeId } = findEmployeeByUserId;
    const facilityReport = await FacilityReport.findById(facilityReportId);
    if (employeeId.toString() !== facilityReport.employeeId.toString()) {
      return res.status(403).json({
        message:
          'This employee did NOT create this facility report! Hence, they CANNOT view the report and as a result, they should NOT be able to comment on it!',
      });
    }

    const { commentDescription } = req.body;
    const newComment = {
      createdBy: employeeId,
      description: commentDescription,
      timestamp: new Date(),
    };
    const newCommentList = [...facilityReport.comments];
    newCommentList.push(newComment);
    await FacilityReport.findByIdAndUpdate(facilityReportId, {
      status: 'In Progress',
      comments: newCommentList,
    });

    res.status(200).json({
      message: 'Successfully added a comment on the Facility Report!',
      prevCommentList: facilityReport.comments,
      newCommentList,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add a comment on the Facility Report!', error });
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
    const { id: userId } = req.user;

    const findEmployeeByUserId = await Employee.findOne({
      userId,
    });
    const { _id: employeeId } = findEmployeeByUserId;
    const facilityReport = await FacilityReport.findById(facilityReportId);
    if (employeeId.toString() !== facilityReport.employeeId.toString()) {
      return res.status(403).json({
        message:
          'This employee did NOT create this facility report! Hence, they CANNOT view the report and as a result, they should NOT be able to update any comments there!',
      });
    }

    const newCommentList = [...facilityReport.comments];
    const { commentId } = req.params;
    const commentToUpdate = newCommentList.find((comment) => {
      return comment._id.toString() === commentId;
    });
    const previousCommentDescription = commentToUpdate.description;
    const { commentDescription } = req.body;
    if (commentToUpdate) {
      commentToUpdate.description = commentDescription;
    }
    await FacilityReport.findByIdAndUpdate(facilityReportId, {
      comments: newCommentList,
    });

    res.status(200).json({
      message: 'Successfully updated the comment',
      prevComment: previousCommentDescription,
      updatedComment: commentToUpdate.description,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update the comment', error });
  }
};
