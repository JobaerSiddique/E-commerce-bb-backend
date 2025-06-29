"use strict";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";
// import { ICloudinaryResponse, IFile } from "../interface/file";
// import config from "../config";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
// Cloudinary Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloud_name,
    api_key: config_1.default.cloud_api,
    api_secret: config_1.default.cloud_secrect,
});
// Create uploads directory if it doesn't exist
const uploadDir = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
    fs_1.default.chmodSync(uploadDir, 0o755); // Set proper permissions
}
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename to prevent collisions
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
// Multer Upload Middleware
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Max 5 files
    }
});
// Cloudinary Upload Function with enhanced error handling
const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // Verify file exists before upload attempt
        if (!fs_1.default.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }
        cloudinary_1.v2.uploader.upload(filePath, { resource_type: "auto" }, // Handle all file types
        (error, result) => {
            // Cleanup: Delete file after upload attempt
            try {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            }
            catch (unlinkError) {
                console.error("File cleanup error:", unlinkError);
            }
            if (error) {
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            else {
                resolve(result);
            }
        });
    });
});
// Export File Uploader Utilities
exports.fileUploader = {
    upload,
    uploadToCloudinary,
};
