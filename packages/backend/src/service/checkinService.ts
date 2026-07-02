import { AppDataSource } from '../db/data-source.js';
import { CheckIn } from '../entities/CheckIn.js';
import { Campaign } from '../entities/Campaign.js';
import { CampaignPhoto } from '../entities/CampaignPhoto.js';
import { User } from '../entities/User.js';
import { Team } from '../entities/Team.js';
import { CheckInInput } from '../schemas/checkin.js';
import { HttpError } from '../errors/HttpError.js';
import { HTTP_STATUS, CHECKIN_ERRORS } from '@uit-volunteer-map/shared';

export class CheckInService {
  private checkInRepo = AppDataSource.getRepository(CheckIn);
  private campaignRepo = AppDataSource.getRepository(Campaign);
  private campaignPhotoRepo = AppDataSource.getRepository(CampaignPhoto);
  private userRepo = AppDataSource.getRepository(User);
  private teamRepo = AppDataSource.getRepository(Team);

  private haversineDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async checkIn(data: CheckInInput, accId: number) {
    const campaign = await this.campaignRepo.findOneBy({ campaignId: data.campaignId });
    if (!campaign) {
      throw new HttpError(CHECKIN_ERRORS.CAMPAIGN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const now = new Date().toISOString().split('T')[0];
    if (now < campaign.startDate || now > campaign.endDate) {
      throw new HttpError(CHECKIN_ERRORS.CAMPAIGN_NOT_ACTIVE, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await this.userRepo.findOne({
      where: { account: { accId }, isDeleted: 0 },
      relations: ['team'],
    });

    if (!user || !user.team) {
      throw new HttpError(CHECKIN_ERRORS.NO_TEAM, HTTP_STATUS.NOT_FOUND);
    }

    const team = await this.teamRepo.findOne({
      where: { teamId: user.team.teamId, isDeleted: 0 },
      relations: ['campaign'],
    });

    if (!team || team.campaign?.campaignId !== data.campaignId) {
      throw new HttpError(CHECKIN_ERRORS.NO_TEAM, HTTP_STATUS.NOT_FOUND);
    }

    if (team.checkInLatitude == null || team.checkInLongitude == null) {
      throw new HttpError(CHECKIN_ERRORS.TEAM_NO_LOCATION, HTTP_STATUS.BAD_REQUEST);
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = await this.checkInRepo
      .createQueryBuilder('ci')
      .where('ci.CampaignId = :campaignId', { campaignId: data.campaignId })
      .andWhere('ci.AccId = :accId', { accId })
      .andWhere('ci.CheckedInAt LIKE :today', { today: `${today}%` })
      .getOne();

    if (existing) {
      throw new HttpError(CHECKIN_ERRORS.ALREADY_CHECKED_IN, HTTP_STATUS.CONFLICT);
    }

    const distance = this.haversineDistance(
      data.latitude,
      data.longitude,
      team.checkInLatitude,
      team.checkInLongitude,
    );

    const radius = team.checkInRadius ?? 100;
    if (distance > radius) {
      throw new HttpError(CHECKIN_ERRORS.OUT_OF_RANGE, HTTP_STATUS.FORBIDDEN);
    }

    const timestamp = new Date().toISOString();
    const checkIn = this.checkInRepo.create({
      campaignId: data.campaignId,
      accId,
      latitude: data.latitude,
      longitude: data.longitude,
      distance: Math.round(distance * 100) / 100,
      checkedInAt: timestamp,
      imageUrl: data.imageUrl ?? null,
    });

    const saved = await this.checkInRepo.save(checkIn);

    // Ảnh điểm danh cũng xuất hiện trên wall ảnh của chiến dịch.
    if (data.imageUrl) {
      const photo = this.campaignPhotoRepo.create({
        campaignId: data.campaignId,
        accId,
        imageUrl: data.imageUrl,
        isCheckinPhoto: 1,
        isDeleted: 0,
        createdAt: timestamp,
      });
      await this.campaignPhotoRepo.save(photo);
    }

    return saved;
  }

  async getHistory(accId: number) {
    return await this.checkInRepo.find({
      where: { accId },
      order: { checkedInAt: 'DESC' },
      relations: ['campaign'],
    });
  }

  /**
   * Các đội leader QUẢN LÝ (Team.leader trỏ tới user của leader), kèm chiến dịch.
   * Trả mảng rỗng nếu leader chưa quản lý đội nào.
   */
  async getManagedTeams(accId: number) {
    const leader = await this.userRepo.findOne({
      where: { account: { accId }, isDeleted: 0 },
    });
    if (!leader) {
      return [];
    }

    const teams = await this.teamRepo.find({
      where: { leader: { userId: leader.userId }, isDeleted: 0 },
      relations: { campaign: true },
      order: { teamName: 'ASC' },
    });

    return teams.map((team) => ({
      teamId: team.teamId,
      teamName: team.teamName,
      campaignId: team.campaign?.campaignId ?? null,
      campaignName: team.campaign?.campaignName ?? null,
    }));
  }

  /**
   * Danh sách điểm danh để leader quản lý. Suy ra các đội leader QUẢN LÝ qua
   * Team.leader; nếu truyền teamId thì phải là đội leader quản lý, nếu không
   * truyền thì lấy đội đầu tiên. Liệt kê TẤT CẢ thành viên đội kèm trạng thái
   * điểm danh trong ngày (mặc định hôm nay).
   */
  async getTeamAttendance(accId: number, teamId?: number, date?: string) {
    const leader = await this.userRepo.findOne({
      where: { account: { accId }, isDeleted: 0 },
    });

    const managedTeams = leader
      ? await this.teamRepo.find({
          where: { leader: { userId: leader.userId }, isDeleted: 0 },
          relations: { campaign: true },
          order: { teamName: 'ASC' },
        })
      : [];

    let team;
    if (teamId != null) {
      team = managedTeams.find((t) => t.teamId === teamId);
      if (!team) {
        throw new HttpError(CHECKIN_ERRORS.FORBIDDEN_TEAM, HTTP_STATUS.FORBIDDEN);
      }
    } else {
      if (managedTeams.length === 0) {
        throw new HttpError(CHECKIN_ERRORS.NO_TEAM, HTTP_STATUS.NOT_FOUND);
      }
      team = managedTeams[0];
    }

    const campaign = team.campaign ?? null;
    const targetDate = date ?? new Date().toISOString().split('T')[0];

    const members = await this.userRepo.find({
      where: { team: { teamId: team.teamId }, isDeleted: 0 },
      relations: { account: true },
      order: { fullName: 'ASC' },
    });

    let checkInsByAcc = new Map<number, CheckIn>();
    if (campaign) {
      const checkIns = await this.checkInRepo
        .createQueryBuilder('ci')
        .where('ci.CampaignId = :campaignId', { campaignId: campaign.campaignId })
        .andWhere('ci.CheckedInAt LIKE :day', { day: `${targetDate}%` })
        .getMany();
      checkInsByAcc = new Map(checkIns.map((ci) => [ci.accId, ci]));
    }

    return {
      teamId: team.teamId,
      teamName: team.teamName,
      campaignId: campaign?.campaignId ?? null,
      campaignName: campaign?.campaignName ?? null,
      date: targetDate,
      members: members.map((m) => {
        const ci = m.account ? checkInsByAcc.get(m.account.accId) : undefined;
        return {
          userId: m.userId,
          fullName: m.fullName,
          mssv: m.mssv ?? null,
          avatarUrl: m.avatarUrl ?? null,
          hasCheckedIn: ci != null,
          checkedInAt: ci?.checkedInAt ?? null,
          distance: ci?.distance ?? null,
          imageUrl: ci?.imageUrl ?? null,
        };
      }),
    };
  }
}
