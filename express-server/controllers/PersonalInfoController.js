import Employee from "../models/Employee.js";
import mongoose from 'mongoose';

// Could populate other data
const findEmployeeById = async (userId) => {
  if (!userId) return null;
  return await Employee.findOne({ userId })
}


/**
 * ==================
 * GET Employee Data
 * ==================
 */

export const getPersonalInfo = async (req, res) => {
  try {
    console.log(req.body);
    const employee = await findEmployeeById(req.body);
    return res.status(200).json({ employee })
  }
  catch (error) {
    return console.log(error);
  }
}



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