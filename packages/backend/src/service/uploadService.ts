import { cloudinary } from '../config/cloudinary.js';

export class UploadService {
  /**
   * Stream một buffer ảnh lên Cloudinary, trả về secure URL.
   */
  async uploadBuffer(buffer: Buffer, folder = 'checkin'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `uit-volunteer-map/${folder}`, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error('Cloudinary upload failed'));
          }
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
  }

  /**
   * Xoá vĩnh viễn một ảnh trên Cloudinary từ secure URL.
   * Lỗi mạng/không tìm thấy được nuốt — soft-delete trong DB là nguồn sự thật.
   */
  async destroyByUrl(secureUrl: string): Promise<void> {
    const publicId = this.extractPublicId(secureUrl);
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch {
      // bỏ qua — không chặn flow xoá nếu Cloudinary không trả về OK.
    }
  }

  /**
   * Tách publicId từ Cloudinary secure URL.
   * Ví dụ: https://res.cloudinary.com/xxx/image/upload/v1700000000/uit-volunteer-map/checkin/abc.jpg
   * -> uit-volunteer-map/checkin/abc
   */
  private extractPublicId(secureUrl: string): string | null {
    const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
    return match ? match[1] : null;
  }
}
