import { getPresignedGetUrl } from '../utils/getPresignedGetUrl.js';

/**
 * @desc    Get a presigned URL for viewing a document
 * @route   GET /api/hr/documents/file
 * @access  HR only
 */
export const getDocument = async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ message: 'Missing file key' });

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

/**
 * @desc    Get a presigned URL for downloading a document
 * @route   GET /api/hr/documents/download
 * @access  HR only
 */
export const downloadDocument = async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ message: 'Missing file key' });

  try {
    // Get URL with download/attachment disposition
    const url = await getPresignedGetUrl(key, 300, { asAttachment: true });
    if (!url) return res.status(404).json({ message: 'File not found or invalid key' });
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate download URL', error: err.message });
  }
};
