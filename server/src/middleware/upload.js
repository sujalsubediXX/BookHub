import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/helpers.js';

export const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase()),
});

export const uploadCover = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new ApiError(400, 'Cover must be a JPG, PNG or WebP image')),
}).single('image');

// only ever deletes files we stored ourselves
export const removeFile = (p) => {
  if (p && p.startsWith('/uploads/')) fs.unlink(path.join(uploadDir, path.basename(p)), () => {});
};
