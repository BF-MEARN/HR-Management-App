import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3-credentials.js";

export const putObject = async (file, key, contentType) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    }

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) {
      return;
    }

    let url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
    console.log('S3 Upload successful:', url);
    return {
      url,
      key: params.Key,
    }
  }
  catch (error) {
    console.error(error);
  }
}