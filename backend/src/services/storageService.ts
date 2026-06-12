import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key',
  },
});

// Service implementation
export const StorageService = {
  /**
   * Upload image to Cloudinary (compresses and resizes to optimal sizes)
   */
  async uploadImage(fileBuffer: Buffer, folder: string = 'trailverse/images'): Promise<string> {
    try {
      if (!process.env.CLOUDINARY_API_KEY) {
        console.log('☁️ Cloudinary not configured. Mocking upload.');
        return `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600`;
      }

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url || '');
          }
        ).end(fileBuffer);
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  },

  /**
   * Upload video or document PDF to AWS S3 Bucket
   */
  async uploadLargeFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME || 'trailverse-india-assets';
      
      if (!process.env.AWS_ACCESS_KEY_ID) {
        console.log('🪣 AWS S3 not configured. Mocking upload.');
        return `https://s3.ap-south-1.amazonaws.com/${bucketName}/${fileName}`;
      }

      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(uploadCommand);
      return `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${fileName}`;
    } catch (err) {
      console.error('AWS S3 upload error:', err);
      throw err;
    }
  }
};
