import multer from 'multer';

// Lưu file vào RAM rồi stream thẳng lên Cloudinary (không ghi đĩa).
const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});
