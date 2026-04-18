import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary (gracefully handle missing credentials)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} else {
    console.warn('Cloudinary credentials not set — image uploads will store base64 fallback.');
}

// Multer: memory storage (buffer, no disk writes)
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

/**
 * Upload a buffer to Cloudinary and return the secure_url.
 * Falls back to a data URL if Cloudinary is not configured.
 */
export const uploadToCloudinary = (buffer, folder = 'ektasahyog/products') => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            // Fallback: return base64 data URL
            const base64 = buffer.toString('base64');
            return resolve(`data:image/jpeg;base64,${base64}`);
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};
