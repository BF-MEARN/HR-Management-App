import mongoose from 'mongoose';
import path from 'path';

import Employee from '../models/Employee.js';
import User from '../models/User.js';
import VisaStatus from '../models/VisaStatus.js';
import { getPresignedGetUrl } from '../utils/getPresignedGetUrl.js';
import { putObject } from '../utils/putObject.js';

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

  return await Employee.findOne({ userId: userId })
    .populate({
      path: 'userId',
      select: 'email',
    })
    .populate('visaInfo');
};

const updateEmployee = async (req, res, next, update) => {
  try {
    const employee = await findEmployeeByAuthUser(req.user.id);

    if (!employee) {
      res.status(404).json({ error: `No employee found` });
    }

    update(employee, req.body);

    await employee.save();
    // save() might clear populated fields
    const populatedEmployee = await findEmployeeByAuthUser(req.user.id);
    res.status(200).json({ employee: populatedEmployee });
  } catch (error) {
    console.error('Error updating employee section:', error);
    next(error);
  }
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

/**
 * @desc    Edit Name Section
 * @route   PUT /api/personal-info/name
 * @access  Employee only
 */
export const editName = async (req, res, next) => {
  await updateEmployee(req, res, next, (employee, body) => {
    const { firstName, lastName, middleName, preferredName, profilePicture, ssn, dob, gender } =
      body;
    if (firstName !== undefined) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;
    employee.middleName = middleName;
    employee.preferredName = preferredName;
    if (profilePicture !== undefined) employee.profilePicture = profilePicture;
    if (ssn !== undefined) employee.ssn = ssn;
    if (dob !== undefined) employee.dob = dob;
    if (gender !== undefined) employee.gender = gender;
  });
};

/**
 * @desc    Edit the User's Email Address
 * @route   PUT /api/personal-info/email
 * @access  Employee only
 */
export const editEmail = async (req, res, next) => {
  try {
    const { email: newEmail } = req.body;
    const userId = req.user.id;

    if (!newEmail) {
      return res.status(400).json({ message: `New email address is required.` });
    }

    const existingUserWithNewEmail = await User.findOne({
      email: newEmail.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUserWithNewEmail) {
      return res
        .status(409)
        .json({ message: `This email address is already registered to another account.` });
    }

    const userToUpdate = await User.findById(userId);

    userToUpdate.email = newEmail.toLowerCase();

    await userToUpdate.save();

    res.status(200).json({ message: 'Email updated successfully.', newEmail: userToUpdate.email });
  } catch (error) {
    console.error('Error updating email:', error);
    next(error);
  }
};

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

/**
 * @desc    Edit Contact Info Section
 * @route   PUT /api/personal-info/contact-info
 * @access  Employee only
 */
export const editContactInfo = async (req, res, next) => {
  await updateEmployee(req, res, next, (employee, body) => {
    const { cellPhone, workPhone } = body;
    if (!employee.contactInfo) {
      employee.contactInfo = {};
    }
    if (cellPhone !== undefined) employee.contactInfo.cellPhone = cellPhone;
    employee.contactInfo.workPhone = workPhone;
  });
};

/**
 * @desc    Edit Employment Info Section
 * @route   PUT /api/personal-info/employment
 * @access  Employee only
 */
export const editEmployment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { workAuthorization } = req.body;

    if (!workAuthorization) {
      return res.status(400).json({ message: 'Missing workAuthorization data in request body.' });
    }

    const { type, startDate, endDate, otherTitle } = workAuthorization;

    const employee = await Employee.findOne({ userId: userId }).select('visaInfo isCitizenOrPR');

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found.' });
    }

    if (employee.isCitizenOrPR || !employee.visaInfo) {
      return res.status(400).json({ message: 'Visa information cannot be edited.' });
    }

    // Find the associated VisaStatus document
    const visaStatus = await VisaStatus.findById(employee.visaInfo);

    if (!visaStatus) {
      console.error(
        `VisaStatus not found for ID ${employee.visaInfo} for employee with userId ${userId}`
      );
      return res.status(404).json({ message: 'Visa status record not found.' });
    }

    if (!visaStatus.workAuthorization) {
      visaStatus.workAuthorization = {};
    }

    if (type !== undefined) visaStatus.workAuthorization.type = type;
    if (startDate !== undefined) visaStatus.workAuthorization.startDate = startDate;
    if (endDate !== undefined) visaStatus.workAuthorization.endDate = endDate;

    if (type === 'Other') {
      visaStatus.workAuthorization.otherTitle =
        otherTitle || visaStatus.workAuthorization.otherTitle;
    } else {
      visaStatus.workAuthorization.otherTitle = undefined;
    }

    visaStatus.markModified('workAuthorization');

    await visaStatus.save();

    // Repopulate in case
    const updatedPopulatedEmployee = await findEmployeeByAuthUser(userId);

    res.status(200).json({
      message: 'Employment (Visa) information updated successfully.',
      employee: updatedPopulatedEmployee,
    });
  } catch (error) {
    console.error('Error updating employment (visa) information:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    next(error);
  }
};

/**
 * @desc    Edit Emergency Contact Section
 * @route   PUT /api/personal-info/emergency-contact
 * @access  Employee only
 */
export const editEmergencyContact = async (req, res, next) => {
  await updateEmployee(req, res, next, (employee, body) => {
    const { emergencyContacts } = body;
    if (!Array.isArray(emergencyContacts)) {
      const error = new Error('Validation failed: emergencyContacts must be an array.');
      error.name = 'ValidationError';
      error.errors = { emergencyContacts: { message: 'Must be an array.' } };
      throw error;
    }
    employee.emergencyContacts = emergencyContacts;
  });
};

/**
 * @desc    Edit Document Metadata and Upload Files
 * @route   PUT /api/personal-info/documents
 * @access  Employee only
 */
export const editDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const employee = await findEmployeeByAuthUser(userId);

    if (!employee) {
      return res.status(404).json({ message: `Employee profile not found.` });
    }

    // --- Handle File Uploads ---
    let profilePictureResult, driverLicenseFileResult;

    if (req.files && req.files.profilePictureFile) {
      const file = req.files.profilePictureFile;
      const fileExtension = path.extname(file.name);
      const key = `employees/${userId}/profile-${Date.now()}${fileExtension}`;

      profilePictureResult = await putObject(file.data, key, file.mimetype);
      if (profilePictureResult) {
        employee.profilePicture = profilePictureResult.key;
      } else {
        console.warn(`Profile picture upload failed for user ${userId}`);
        return res.status(500).json({ message: 'Profile picture upload failed.' });
      }
    }

    if (req.files && req.files.driverLicenseFile) {
      const file = req.files.driverLicenseFile;
      const fileExtension = path.extname(file.name);
      const key = `employees/${userId}/driversLicense-${Date.now()}${fileExtension}`;

      driverLicenseFileResult = await putObject(file.data, key, file.mimetype);
      if (driverLicenseFileResult) {
        if (!employee.driverLicense) employee.driverLicense = {};
        employee.driverLicense.file = driverLicenseFileResult.key;
      } else {
        console.warn(`Driver's license upload failed for user ${userId}`);
        return res.status(500).json({ message: 'Driver license upload failed.' });
      }
    }

    // --- Handle Metadata Updates from req.body ---
    const { driverLicense: driverLicenseMetadata, profilePicture: profilePictureMetadata } =
      req.body;

    if (!profilePictureResult && profilePictureMetadata !== undefined) {
      employee.profilePicture = profilePictureMetadata;
    }

    if (driverLicenseMetadata !== undefined) {
      if (!employee.driverLicense) employee.driverLicense = {};
      if (driverLicenseMetadata.number !== undefined)
        employee.driverLicense.number = driverLicenseMetadata.number;
      if (driverLicenseMetadata.expirationDate !== undefined)
        employee.driverLicense.expirationDate = driverLicenseMetadata.expirationDate;

      if (!driverLicenseFileResult && driverLicenseMetadata.file !== undefined) {
        employee.driverLicense.file = driverLicenseMetadata.file;
      }

      // eslint-disable-next-line no-prototype-builtins
    } else if (req.body.hasOwnProperty('driverLicense') && req.body.driverLicense === null) {
      employee.driverLicense = undefined;
    }

    // --- Save and Respond ---
    await employee.save();
    const updatedPopulatedEmployee = await findEmployeeByAuthUser(userId);

    res.status(200).json({
      message: `Documents information updated successfully.`,
      employee: updatedPopulatedEmployee,
    });
  } catch (error) {
    console.error(`Error updating documents:`, error);
    next(error);
  }
};

/**
 * @desc    Get a presigned URL for downloading/previewing a specific document
 * @route   GET /api/personal-info/document-url
 * @access  Employee only
 */
export const getDocumentUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: 'Missing "type" query parameter.' });
    }

    const employee = await findEmployeeByAuthUser(userId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found.' });
    }

    let s3Key = null;

    switch (type) {
      case 'profile':
        s3Key = employee.profilePicture;
        break;
      case 'driverLicense':
        s3Key = employee.driverLicense?.file;
        break;
      case 'optReceipt':
        s3Key = employee.visaInfo?.optReceipt?.file;
        break;
      case 'optEAD':
        s3Key = employee.visaInfo?.optEAD?.file;
        break;
      case 'i983':
        s3Key = employee.visaInfo?.i983?.file;
        break;
      case 'i20':
        s3Key = employee.visaInfo?.i20?.file;
        break;
      default:
        return res.status(400).json({ message: `Invalid document type "${type}" specified.` });
    }

    if (!s3Key) {
      console.log(`Document of type "${type}" not found or no key stored for user ${userId}.`);
      return res
        .status(404)
        .json({ message: `Document of type "${type}" not found or not uploaded.` });
    }

    const presignedUrl = await getPresignedGetUrl(s3Key);

    if (!presignedUrl) {
      return res.status(500).json({
        message: `Failed to generate URL for document type "${type}". Check server logs.`,
      });
    }

    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error(`Error getting document URL for type "${req.query.type}":`, error);
    next(error);
  }
};
