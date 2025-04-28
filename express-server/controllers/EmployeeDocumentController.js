import path from 'path';

import { getPresignedGetUrl } from '../utils/getPresignedGetUrl.js';
import { putObject } from '../utils/putObject.js';

export const uploadOnboardingDocument = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;

    // E.g., 'profilePictureFile', 'driverLicenseFile', 'optReceiptFile'
    const fileField = Object.keys(req.files)[0];
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

export const getDocument = async (req, res) => {
  const userId = req.user.id;
  const { key } = req.query;
  if (!key) return res.status(400).json({ message: 'Missing file key' });
  const tmp = key.split('/');
  if (tmp[0] !== 'employees' || tmp[1] !== userId)
    return res.status(403).json({ message: 'You are not authorized to access this document.' });

  try {
    // Get URL for viewing (no download/attachment disposition)
    const url = await getPresignedGetUrl(key);
    if (!url) return res.status(404).json({ message: 'File not found or invalid key' });
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate presigned URL', error: err.message });
  }
};
