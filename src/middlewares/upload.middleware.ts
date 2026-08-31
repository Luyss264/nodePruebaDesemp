import fs from "fs";
import multer from "multer";
import { ApiError } from "../utils/ApiErrors.js";

const uploadDirectory = "uploads";
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_request, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!file.originalname.toLowerCase().endsWith(".json")) {
      callback(new ApiError("Only JSON files are allowed", 400));
      return;
    }

    callback(null, true);
  }
});
