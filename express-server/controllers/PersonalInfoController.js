import Employee from "../models/Employee.js";
import mongoose from 'mongoose';

// Could populate other data
const findEmployeeByAuthUser = async (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    console.error('Invalid userId passed to findEmployeeByAuthUser:', userId);
    return null;
  }
  
  return await Employee.findOne({ userId: userId }).populate('visaInfo');
};


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

}

export const editAddress = async (req, res) => {

}

export const editContactInfo = async (req, res) => {

}

export const editEmployment = async (req, res) => {

}

export const editEmergencyContact = async (req, res) => {

}

export const editDocuments = async (req, res) => {

}