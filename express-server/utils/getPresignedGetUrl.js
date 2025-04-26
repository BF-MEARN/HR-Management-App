import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from './s3-credentials.js';

/**
 * Generates a presigned URL for securely reading an object from S3.
 * @param {string} key The S3 object key.
 * @param {number} expiresIn The duration in seconds the URL should be valid for in seconds.
 * @returns The presigned URL.
 */
export const getPresignedGetUrl = async (key, expiresIn = 300, options = {}) => {
  if (!key) {
    console.error('getPresignedGetUrl: No key provided.');
    return null;
  }
  if (!process.env.AWS_S3_BUCKET_NAME) {
    console.error('getPresignedGetUrl: AWS_S3_BUCKET_NAME environment variable not set.');
    return null;
  }

  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    // If asAttachment is true, add parameters to force download
    if (options.asAttachment) {
      // Extract filename from key (last part after the last slash)
      const filename = key.split('/').pop() || 'document.pdf';
      params.ResponseContentDisposition = `attachment; filename="${filename}"`;

      // For PDF and other files, this ensures they download instead of opening in browser
      params.ResponseContentType = 'application/octet-stream';
    }

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    console.log(
      `Generated presigned GET URL for key "${key}"${options.asAttachment ? ' as download' : ''}`
    );
    return url;
  } catch (error) {
    console.error(`Error generating presigned GET URL for key "${key}":`, error);
    if (error.name === 'NoSuchKey') {
      console.warn(`S3 key "${key}" not found.`);
    }
    return;
  }
};
