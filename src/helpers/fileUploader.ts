// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary } from "cloudinary";
// import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djjuqhids",
//   api_key: process.env.CLOUDINARY_API_KEY || "223418176384988",
//   api_secret:
//     process.env.CLOUDINARY_API_SECRET || "lV-GM5lVDXxWKkIEyiyUiZoNCow",
// });

// const storage = multer.memoryStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// const uploadToCloudinary = async (
//   file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//   // console.log("file", file);

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file.path,
//       (error: Error, result: ICloudinaryResponse) => {
//         fs.unlinkSync(file.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };

// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import { randomUUID } from "crypto";
// import { Express } from "express";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djjuqhids",
//   api_key: process.env.CLOUDINARY_API_KEY || "223418176384988",
//   api_secret: process.env.CLOUDINARY_API_SECRET || "lV-GM5lVDXxWKkIEyiyUiZoNCow",
// });

// // Memory storage for Multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Ensure uploads directory exists
// const uploadsDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Upload file to Cloudinary
// const uploadToCloudinary = async (
//   file: Express.Multer.File
// ): Promise<UploadApiResponse | undefined> => {
//   try {
//     const tempFilePath = path.join(uploadsDir, `${randomUUID()}-${file.originalname}`);
//     fs.writeFileSync(tempFilePath, file.buffer);

//     const result = await cloudinary.uploader.upload(tempFilePath);
//     fs.unlinkSync(tempFilePath); // Cleanup temp file

//     return result;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     return undefined;
//   }
// };

// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djjuqhids",
  api_key: process.env.CLOUDINARY_API_KEY || "223418176384988",
  api_secret: process.env.CLOUDINARY_API_SECRET || "lV-GM5lVDXxWKkIEyiyUiZoNCow",
});

// Use memoryStorage to get buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<UploadApiResponse | undefined> => {
  const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}-${file.originalname}`);
  fs.writeFileSync(tempFilePath, file.buffer);

  try {
    const result = await cloudinary.uploader.upload(tempFilePath);
    fs.unlinkSync(tempFilePath);
    return result;
  } catch (error) {
    fs.unlinkSync(tempFilePath);
    throw error;
  }
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};

