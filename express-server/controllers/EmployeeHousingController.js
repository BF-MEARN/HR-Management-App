import Employee from '../models/Employee.js';
import Housing from '../models/Housing.js';

/**
 * @desc    Auto-assign a new employee into an available house
 * @route   POST /api/employee/housing/autoAssignHousing
 * @access  Employee only
 */
export const autoAssignHousing = async (req, res, next) => {
  try {
    const allHouses = await Housing.find();
    const randomIndex = Math.floor(Math.random() * allHouses.length);
    const randomHouse = allHouses[randomIndex];

    const address = randomHouse.address;
    const { employeeId: _id } = req.body;
    // This is for the addResidentToHousing in the EmployeeOnboardingController.js
    req.autoAssign = { address, _id };
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to auto-assign an employee to a house!', error: error.message });
  }
};

/**
 * @desc    Get the house that the current user is living in as an employee
 * @route   GET /api/employee/housing/getHouse
 * @access  Employee only
 */
export const getCurrentEmployeeHouse = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const findEmployeeByUserId = await Employee.findOne({
      userId,
    });

    const { houseId } = findEmployeeByUserId;
    const findEmployeeHouse = await Housing.findById(houseId);

    res.status(200).json({
      message: "Successfully found the user's assigned employee house",
      house: findEmployeeHouse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get the current user's assigned employee house!", error });
  }
};
