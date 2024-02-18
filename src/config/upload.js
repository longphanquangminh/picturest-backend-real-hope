import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a storage engine with Cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "picturest",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "bmp", "tiff", "webp", "svg", "heif", "raw"], // Optional - specify the allowed formats
    // Other Cloudinary parameters can be added here as needed
  },
});

// Initialize multer with Cloudinary storage engine
const upload = multer({ storage: cloudinaryStorage });

export default upload;
