import Employee from '../models/Employee.js';
import FacilityReport from '../models/FacilityReport.js';
import Housing from '../models/Housing.js';
import User from '../models/User.js';

/**
 * @desc    Get all houses
 * @route   GET /api/hr/housing
 * @access  HR only
 */
export const getAllHouses = async (req, res) => {
  try {
    const houses = await Housing.find().populate('residents', '_id');
    res.status(200).json(houses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch houses', error: err.message });
  }
};

/**
 * @desc    Create a new house
 * @route   POST /api/hr/housing
 * @access  HR only
 */
export const createHouse = async (req, res) => {
  try {
    const { address, landlord, facility } = req.body;
    const existing = await Housing.findOne({
      'address.street': address.street,
      'address.city': address.city,
      'address.state': address.state,
      'address.zip': address.zip,
    });
    if (existing) {
      return res.status(400).json({ message: 'House already exists at this address' });
    }

    const house = await Housing.create({ address, landlord, facility, residents: [] });
    res.status(201).json(house);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create house', error: err.message });
  }
};

/**
 * @desc    Delete a house by ID
 * @route   DELETE /api/hr/housing/:id
 * @access  HR only
 */
export const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await Housing.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete house', error: err.message });
  }
};

/**
 * @desc    Get a house by ID
 * @route   GET /api/hr/housing/:id
 * @access  HR only
 */
export const getHouseById = async (req, res) => {
  try {
    const house = await Housing.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }
    res.status(200).json(house);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch house', error: err.message });
  }
};

/**
 * @desc    Get list of residents for a house
 * @route   GET /api/hr/housing/:id/residents
 * @access  HR only
 */
export const getResidentsByHouseId = async (req, res) => {
  try {
    const residents = await Employee.find({ houseId: req.params.id })
      .select('firstName lastName preferredName contactInfo.cellPhone email carInfo')
      .populate('userId', 'email')
      .lean();
    res.status(200).json(residents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch residents', error: err.message });
  }
};

/**
 * @desc    Get facility reports for a house
 * @route   GET /api/hr/housing/:id/reports
 * @access  HR only
 */

export const getReportsByHouseId = async (req, res) => {
  try {
    const reports = await FacilityReport.find({ houseId: req.params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'employeeId',
        select: 'firstName lastName preferredName userId',
        populate: {
          path: 'userId',
          select: 'username email',
        },
      })
      .populate({
        path: 'comments.createdBy',
        model: 'Employee',
        select: 'firstName lastName preferredName',
      })
      .lean();

    res.status(200).json(reports);
  } catch (err) {
    console.error('[FacilityReport Error]', err);
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

/**
 * @desc    Add a comment on a facility report
 * @route   POST /api/hr/housing/report/:reportId/comments
 * @access  HR only
 */
export const addComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { description } = req.body;

    const report = await FacilityReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if the report is closed
    if (report.status === 'Closed') {
      return res.status(403).json({ message: 'Cannot add comments to a closed report' });
    }

    // Get the employee associated with this user
    const user = await User.findById(req.user.id);
    if (!user || !user.employeeId) {
      return res.status(400).json({ message: 'User has no associated employee record' });
    }

    report.comments.push({
      createdBy: user.employeeId,
      description,
      timestamp: new Date(),
    });

    //  If status is 'Open', update to 'In Progress' regardless of comment count
    //  (This covers both the first comment case and the edge case mentioned)
    if (report.status === 'Open') {
      report.status = 'In Progress';
    }

    await report.save();
    res.status(201).json({
      message: 'Comment added',
      updatedStatus: report.status,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

/**
 * @desc    Update a comment on a facility report
 * @route   PUT /api/hr/housing/report/:reportId/comments/:commentId
 * @access  HR only
 */

export const updateComment = async (req, res) => {
  try {
    const { reportId, commentId } = req.params;
    const { description } = req.body;

    const report = await FacilityReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Get the employee associated with this user
    const user = await User.findById(req.user.id);
    if (!user || !user.employeeId) {
      return res.status(400).json({ message: 'User has no associated employee record' });
    }

    // Check if the logged-in user is the one who created the comment
    // Compare the employeeId strings
    if (String(comment.createdBy) !== String(user.employeeId)) {
      return res.status(403).json({ message: 'You are not allowed to edit this comment' });
    }

    comment.description = description;
    comment.timestamp = new Date();
    await report.save();

    res.status(200).json({ message: 'Comment updated' });
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};
