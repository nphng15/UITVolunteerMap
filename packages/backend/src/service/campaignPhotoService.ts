import { AppDataSource } from '../db/data-source.js';
import { CampaignPhoto } from '../entities/CampaignPhoto.js';
import { CheckIn } from '../entities/CheckIn.js';
import { User } from '../entities/User.js';
import { CampaignPhotoInput } from '../schemas/checkin.js';
import { HttpError } from '../errors/HttpError.js';
import { UploadService } from './uploadService.js';
import {
  HTTP_STATUS,
  CAMPAIGN_PHOTO_ERRORS,
  RoleEnum,
} from '@uit-volunteer-map/shared';

export class CampaignPhotoService {
  private photoRepo = AppDataSource.getRepository(CampaignPhoto);
  private checkInRepo = AppDataSource.getRepository(CheckIn);
  private userRepo = AppDataSource.getRepository(User);
  private uploadService = new UploadService();

  /** Wall ảnh của một chiến dịch, kèm thông tin người đăng. Mới nhất trước. */
  async getCampaignWall(campaignId: number) {
    const photos = await this.photoRepo.find({
      where: { campaignId, isDeleted: 0 },
      order: { createdAt: 'DESC' },
    });

    const accIds = [...new Set(photos.map((p) => p.accId))];
    const users = accIds.length
      ? await this.userRepo.find({
          where: accIds.map((accId) => ({ account: { accId } })),
          relations: { account: true, team: true },
        })
      : [];
    const userByAcc = new Map(
      users
        .filter((u) => u.account)
        .map((u) => [u.account!.accId, u]),
    );

    return photos.map((photo) => {
      const user = userByAcc.get(photo.accId);
      return {
        campaignPhotoId: photo.campaignPhotoId,
        campaignId: photo.campaignId,
        accId: photo.accId,
        imageUrl: photo.imageUrl,
        caption: photo.caption ?? null,
        isCheckinPhoto: photo.isCheckinPhoto,
        createdAt: photo.createdAt,
        author: {
          fullName: user?.fullName ?? 'Tình nguyện viên',
          avatarUrl: user?.avatarUrl ?? null,
          teamName: user?.team?.teamName ?? null,
        },
      };
    });
  }

  /** Đăng một ảnh khoảnh khắc. Yêu cầu đã điểm danh chiến dịch này. */
  async addMoment(campaignId: number, accId: number, data: CampaignPhotoInput) {
    const hasCheckedIn = await this.checkInRepo.findOneBy({ campaignId, accId });
    if (!hasCheckedIn) {
      throw new HttpError(
        CAMPAIGN_PHOTO_ERRORS.NOT_CHECKED_IN,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const photo = this.photoRepo.create({
      campaignId,
      accId,
      imageUrl: data.imageUrl,
      caption: data.caption ?? null,
      isCheckinPhoto: 0,
      isDeleted: 0,
      createdAt: new Date().toISOString(),
    });
    const saved = await this.photoRepo.save(photo);
    // Trả về kèm author để client thêm vào wall optimistic.
    const user = await this.userRepo.findOne({
      where: { account: { accId } },
      relations: { account: true, team: true },
    });
    return {
      campaignPhotoId: saved.campaignPhotoId,
      campaignId: saved.campaignId,
      accId: saved.accId,
      imageUrl: saved.imageUrl,
      caption: saved.caption ?? null,
      isCheckinPhoto: saved.isCheckinPhoto,
      createdAt: saved.createdAt,
      author: {
        fullName: user?.fullName ?? 'Tình nguyện viên',
        avatarUrl: user?.avatarUrl ?? null,
        teamName: user?.team?.teamName ?? null,
      },
    };
  }

  /**
   * Soft-delete trong DB + xoá vĩnh viễn trên Cloudinary.
   * Quyền: chủ ảnh hoặc admin/leader.
   */
  async deletePhoto(
    campaignId: number,
    photoId: number,
    accId: number,
    role: string,
  ) {
    const photo = await this.photoRepo.findOneBy({
      campaignPhotoId: photoId,
      campaignId,
    });
    if (!photo || photo.isDeleted === 1) {
      throw new HttpError(
        CAMPAIGN_PHOTO_ERRORS.PHOTO_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const isModerator =
      role === RoleEnum.ADMIN || role === RoleEnum.LEADER;
    if (photo.accId !== accId && !isModerator) {
      throw new HttpError(
        CAMPAIGN_PHOTO_ERRORS.FORBIDDEN,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    photo.isDeleted = 1;
    await this.photoRepo.save(photo);
    // Xoá ảnh khỏi Cloudinary (nuốt lỗi — DB là nguồn sự thật).
    await this.uploadService.destroyByUrl(photo.imageUrl);
  }
}
