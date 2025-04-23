import mongoose from 'mongoose';

import Employee from '../models/Employee.js';
import Housing from '../models/Housing.js';
import VisaStatus from '../models/VisaStatus.js';

export const validateRegistrationToken = async (req, res) => {
  try {
    const { tokenUUID } = req.params;

    // not expired, not used
    const token = await RegistrationToken.findOne({
      token: tokenUUID,
      expiresAt: { $gt: new Date() },
      used: false,
    });
    if (!token) {
      return res.status(404).json({ message: 'Registration token not found or invalid.' });
    }
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate employee registration token ', error });
  }
}

export const createNewEmployee = async (req, res) => {
  try {
    const {
      userId,
      houseId,
      visaInfo,
      firstName,
      lastName,
      middleName,
      profilePicture,
      ssn,
      dob,
      gender,
      isCitizenOrPR,
      emergencyContacts,
      contactInfo,
      address,
    } = req.body;

    const existingEmployee = await Employee.findOne({ ssn });

    if (existingEmployee) {
      return res.status(400).json({ message: 'SSN already registered.' });
    }

    const newEmployee = new Employee({
      userId,
      houseId,
      visaInfo,
      firstName,
      lastName,
      middleName,
      profilePicture,
      dob,
      ssn,
      gender,
      isCitizenOrPR,
      emergencyContacts,
      contactInfo,
      address,
    });

    await newEmployee.save();

    res.status(201).json({ message: `Employee registration successful!` });
  } catch (error) {
    console.error('Error creating new employee:', error);
    res.status(500).json({ message: 'Failed to post new employee information in system: ', error });
  }
};

export const createHousing = async (req, res) => {
  try {
    const { address, landlord, facility } = req.body;

    const existingHousing = await Housing.findOne({
      'address.street': address.street,
      'address.city': address.city,
      'address.state': address.state,
      'address.zip': address.zip,
    });

    if (existingHousing) {
      return res.status(400).json({ message: 'Housing already exists in database' });
    }

    const newHousing = new Housing({
      address,
      landlord,
      facility,
      residents: [],
    });

    await newHousing.save();

    res.status(201).json({ message: `New housing info successfully posted to database!` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post new housing', error });
  }
};

export const addResidentToHousing = async (req, res) => {
  try {
    // front end should send address of housing and _id of employee to add
    const { address, _id } = 'address' in req.body && '_id' in req.body ? req.body : req.autoAssign;

    const residentId = new mongoose.Types.ObjectId(_id);

    let employee = await Employee.findOne({ _id });

    if (!employee) {
      return res.status(400).json({ message: 'No employee matches the given ID' });
    }

    let existingHousing = await Housing.findOne({
      'address.street': address.street,
      'address.city': address.city,
      'address.state': address.state,
      'address.zip': address.zip,
    });

    if (!existingHousing) {
      return res
        .status(400)
        .json({ message: 'No housing matching this address exists in the database' });
    }

    employee.houseId = existingHousing._id;
    employee.address.city = existingHousing.address.city;
    employee.address.state = existingHousing.address.state;
    employee.address.street = existingHousing.address.street;
    employee.address.zip = existingHousing.address.zip;

    await employee.save();

    if (!existingHousing.residents.includes(residentId)) {
      existingHousing.residents.push(residentId);
    }

    await existingHousing.save();

    res.status(200).json({ message: 'Successfully added resident to housing list!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post new resident to housing', error });
  }
};

export const getEmployeeData = async (req, res) => {
  try {
    const { _id } = req.params;

    const employee = await Employee.findOne({ _id });

    if (!employee) {
      res.status(400).json({ message: 'employee could not be found with given _id' });
    }

    res.status(200).json({ message: 'Employee data found!', employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employee data', error });
  }
};

export const getVisaStatus = async (req, res) => {
  try {
    const { _id } = req.params;

    const visaStatus = await VisaStatus.findOne({ employeeId: _id });

    if (!visaStatus) {
      res.status(400).json({ message: 'Unable to retrieve visa status with given id' });
    }

    res.status(200).json({ message: 'Visa status retrieved successfully', visaStatus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve visa status', error });
  }
};

export const updateOptReceipt = async (req, res) => {
  try {
    const { _id, optReceipt } = req.body;

    const updatedEmployee = await VisaStatus.findOneAndUpdate(
      { employeeId: _id },
      {
        $set: {
          'optReceipt.file': optReceipt.file,
          'optReceipt.status': optReceipt.status,
          'optReceipt.feedback': optReceipt.feedback,
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'OPT Receipt updated successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update OPT receipt', error });
  }
};

export const updateOptEAD = async (req, res) => {
  try {
    const { _id, optEAD } = req.body;

    const updatedEmployee = await VisaStatus.findOneAndUpdate(
      { employeeId: _id },
      {
        $set: {
          'optEAD.file': optEAD.file,
          'optEAD.status': optEAD.status,
          'optEAD.feedback': optEAD.feedback,
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'OPT EAD updated successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update OPT EAD', error });
  }
};

export const updateI983 = async (req, res) => {
  try {
    const { _id, i983 } = req.body;

    const updatedEmployee = await VisaStatus.findOneAndUpdate(
      { employeeId: _id },
      {
        $set: {
          'i983.file': i983.file,
          'i983.status': i983.status,
          'i983.feedback': i983.feedback,
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'I-983 updated successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update I-983', error });
  }
};

export const updateI20 = async (req, res) => {
  try {
    const { _id, i20 } = req.body;

    const updatedEmployee = await VisaStatus.findOneAndUpdate(
      { employeeId: _id },
      {
        $set: {
          'i20.file': i20.file,
          'i20.status': i20.status,
          'i20.feedback': i20.feedback,
        },
      },
      { new: true } // returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'I-20 updated successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update I-20', error });
  }
};
