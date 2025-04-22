import mongoose from 'mongoose'
import Employee from '../models/Employee.js';
import Housing from '../models/Housing.js';

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
      "address.street": address.street,
      "address.city": address.city,
      "address.state": address.state,
      "address.zip": address.zip
    })

    if (existingHousing) {
      return res.status(400).json({ message: 'Housing already exists in database' })
    }

    const newHousing = new Housing({
      address, landlord, facility, residents: []
    })

    await newHousing.save();

    res.status(201).json({ message: `New housing info successfully posted to database!` });
  } catch (error) {
    console.error('Error posting new housing:', error);
    res.status(500).json({ message: 'Failed to post new housing', error });
  }
}

export const addResidentToHousing = async (req, res) => {
  try {
    // front end should send address of housing and _id of employee to add
    const { address, _id } = req.body;

    let existingHousing = await Housing.findOne({
      "address.street": address.street,
      "address.city": address.city,
      "address.state": address.state,
      "address.zip": address.zip
    })

    if (!existingHousing) {
      return res.status(400).json({ message: 'No housing matching this address exists in the database' })
    }

    const residentId = new mongoose.Types.ObjectId(_id);

    existingHousing.residents.push(residentId)

    await existingHousing.save()

    res.status(200).json({ message: 'Successfully added resident to housing list!' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to post new resident to housing', error });
  }
}
