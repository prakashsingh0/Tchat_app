import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
await fs.mkdir(uploadDir, { recursive: true });

// ✅ Allowed file types
const FILE_TYPES = {
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/x-matroska': '.mkv',
  'video/avi': '.avi',
  'video/quicktime': '.mov',
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/m4a': '.m4a',
  'audio/ogg': '.ogg',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = FILE_TYPES[file.mimetype] || path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (FILE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type! Got mimetype: ${file.mimetype}, ext: ${path
          .extname(file.originalname)
          .toLowerCase()}`
      )
    );
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300 MB
});

// Async utility to safely delete files
export const removeLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`🗑 Deleted file: ${filePath}`);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Failed to delete file:', err);
  }
};

export default upload;
