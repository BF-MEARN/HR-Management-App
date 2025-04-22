import Employee from "../models/Employee.js";
import mongoose from 'mongoose';

/**
 * ==================
 * Helpers
 * ==================
 * 
 */
// Could populate other data
const findEmployeeByAuthUser = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    console.error('Invalid userId passed to findEmployeeByAuthUser:', userId);
    return null;
  }

  return await Employee.findOne({ userId: userId }).populate('visaInfo');
};

const updateEmployee = async (req, res, next, update) => {
  try {
    const employee = await findEmployeeByAuthUser(req.user.id);

    if (!employee) {
      res.status(404).json({ error: `No employee found` });
    }

    update(employee, req.body);

    const updatedEmployee = await employee.save();
    res.status(200).json({ employee: updatedEmployee });
  }
  catch (error) {
    console.error('Error updating employee section:', error);
    next(error);
  }
}


/**
 * ==================
 * GET Employee Data
 * ==================
 * @route   GET /api/personal-info/
 * @access  Employee only
 */

export const getPersonalInfo = async (req, res, next) => {
  try {
    const employee = await findEmployeeByAuthUser(req.user.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found for this user.' });
    }

    return res.status(200).json({ employee });
  } catch (error) {
    console.error('Error in getPersonalInfo:', error);
    next(error);
  }
};



/**
 * ==================
 * PUT Sections
 * ==================
 */
export const editName = async (req, res) => {
  await updateEmployee(req, res, next, (employee, body) => {
    const { firstName, lastName, middleName, preferredName, profilePicture, ssn, dob, gender } = body;
    if (firstName !== undefined) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;
    employee.middleName = middleName;
    employee.preferredName = preferredName;
    if (profilePicture !== undefined) employee.profilePicture = profilePicture;
  })
}

/**
 * @desc    Edit Address Section
 * @route   PUT /api/personal-info/address
 * @access  Employee only
 */
export const editAddress = async (req, res, next) => {
  await updateEmployee(req, res, next, (employee, body) => {
    const { building, street, city, state, zip } = body;
    if (!employee.address) {
      employee.address = {};
    }
    if (building !== undefined) employee.address.building = building;
    if (street !== undefined) employee.address.street = street;
    if (city !== undefined) employee.address.city = city;
    if (state !== undefined) employee.address.state = state;
    if (zip !== undefined) employee.address.zip = zip;
  });
};

export const editContactInfo = async (req, res) => {

}

export const editEmployment = async (req, res) => {

}

export const editEmergencyContact = async (req, res) => {

}

export const editDocuments = async (req, res) => {

}