import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from './s3-credentials';

export const deleteObject = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) return { status: 400, data };
    return { status: 200 };
  } catch (error) {
    console.error(error);
  }
};
