// adjust if path different
import path from 'path';

import { putObject } from '../utils/putObject.js';

export const uploadOnboardingDocument = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;

    const fileField = Object.keys(req.files)[0]; // E.g., 'profilePictureFile', 'driverLicenseFile', 'optReceiptFile'
    const file = req.files[fileField];

    let s3Key;

    if (fileField === 'profilePictureFile') {
      s3Key = `employees/${userId}/profile${path.extname(file.name)}`;
    } else if (fileField === 'driverLicenseFile') {
      s3Key = `employees/${userId}/driversLicense${path.extname(file.name)}`;
    } else if (fileField === 'optReceiptFile') {
      s3Key = `employees/${userId}/optReceipt${path.extname(file.name)}`;
    } else {
      return res.status(400).json({ message: 'Invalid file field' });
    }

    await putObject(file.data, s3Key, file.mimetype);

    return res.status(200).json({ s3Key });
  } catch (error) {
    console.error('Error uploading onboarding document:', error);
    return res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
};
