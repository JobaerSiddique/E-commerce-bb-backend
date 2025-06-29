// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";
// import { ICloudinaryResponse, IFile } from "../interface/file";
// import config from "../config";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: config.cloud_name,
//   api_key: config.cloud_api,
//   api_secret: config.cloud_secrect,
// });

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd(), "uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// // Multer Upload Middleware
// const upload = multer({ storage: storage });

// // Cloudinary Upload Function
// const uploadToCloudinary = async (file: string): Promise<ICloudinaryResponse | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file,
//       (error: Error, result: ICloudinaryResponse) => {
//         // Cleanup: Delete file after attempting upload
//         if (fs.existsSync(file)) {
//           try {
//             fs.unlinkSync(file);
//           } catch (unlinkError) {
//             console.error("Failed to delete temporary file:", unlinkError);
//           }
//         }

//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };

// // Export File Uploader Utilities
// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryResponse, IFile } from "../interface/file";
import config from "../config";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api,
  api_secret: config.cloud_secrect,
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.chmodSync(uploadDir, 0o755); // Set proper permissions
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to prevent collisions
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer Upload Middleware
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  }
});

// Cloudinary Upload Function with enhanced error handling
const uploadToCloudinary = async (filePath: string): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    // Verify file exists before upload attempt
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    cloudinary.uploader.upload(
      filePath,
      { resource_type: "auto" }, // Handle all file types
      (error: Error, result: ICloudinaryResponse) => {
        // Cleanup: Delete file after upload attempt
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (unlinkError) {
          console.error("File cleanup error:", unlinkError);
        }

        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Export File Uploader Utilities
export const fileUploader = {
  upload,
  uploadToCloudinary,
};