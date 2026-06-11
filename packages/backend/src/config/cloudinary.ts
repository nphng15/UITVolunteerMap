import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

// CLOUDINARY_URL trong .env (dạng cloudinary://key:secret@cloud) được SDK tự đọc.
// import 'dotenv/config' phía trên đảm bảo .env đã nạp xong trước khi cloudinary.config() đọc.
cloudinary.config();

export { cloudinary };
