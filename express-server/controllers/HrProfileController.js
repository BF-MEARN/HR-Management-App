import Employee from '../models/Employee.js';

/**
 * @desc    Get all employee profiles for HR view
 * @route   GET /api/hr/profiles
 * @access  HR only
 */
export const getAllProfiles = async (req, res) => {
  try {
    const employees = await Employee.find({})
      .populate('userId', 'email role')
      .populate({
        path: 'visaInfo',
        select: 'workAuthorization.type workAuthorization.startDate workAuthorization.endDate',
      })
      .select('firstName lastName preferredName ssn contactInfo visaInfo userId')
      .lean();

    const transformed = employees.map((emp) => ({
      ...emp,
      workAuthorizationType: emp.visaInfo?.workAuthorization?.type || 'N/A',
    }));

    res.status(200).json(transformed);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee data.', error: err.message });
  }
};

/**
 * @desc    Get a specific employee profile by ID
 * @route   GET /api/hr/profiles/:id
 * @access  HR only
 */
export const getProfileById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId', 'email role').lean();

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};
