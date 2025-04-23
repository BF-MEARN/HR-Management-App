import Employee from '../models/Employee.js';
import FacilityReport from '../models/FacilityReport.js';
import Housing from '../models/Housing.js';

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
 * @desc    Get list of residents for a house
 * @route   GET /api/hr/housing/:id/residents
 * @access  HR only
 */
export const getResidentsByHouseId = async (req, res) => {
  try {
    const residents = await Employee.find({ houseId: req.params.id })
      .select('firstName lastName preferredName contactInfo.cellPhone email carInfo')
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
export const getFacilityReportsByHouseId = async (req, res) => {
  try {
    const reports = await FacilityReport.find({ houseId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username')
      .lean();
    res.status(200).json(reports);
  } catch (err) {
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

    report.comments.push({
      createdBy: req.user.id,
      description,
      timestamp: new Date(),
    });

    await report.save();
    res.status(201).json({ message: 'Comment added' });
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
    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.description = description;
    comment.timestamp = new Date();
    await report.save();

    res.status(200).json({ message: 'Comment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};
