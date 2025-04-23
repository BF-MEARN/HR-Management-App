import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3-credentials.js";

/**
 * Generates a presigned URL for securely reading an object from S3.
 * @param {string} key The S3 object key.
 * @param {number} expiresIn The duration in seconds the URL should be valid for in seconds.
 * @returns The presigned URL.
 */
export const getPresignedGetUrl = async (key, expiresIn = 300) => {
  if (!key) {
    console.error("getPresignedGetUrl: No key provided.");
    return null;
  }
  if (!process.env.AWS_S3_BUCKET_NAME) {
    console.error("getPresignedGetUrl: AWS_S3_BUCKET_NAME environment variable not set.");
    return null;
  }

  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn });

    console.log(`Generated presigned GET URL for key "${key}"`);
    return url;

  } catch (error) {
    console.error(`Error generating presigned GET URL for key "${key}":`, error);
    if (error.name === 'NoSuchKey') {
      console.warn(`S3 key "${key}" not found.`);
    }
    return;
  }
};
