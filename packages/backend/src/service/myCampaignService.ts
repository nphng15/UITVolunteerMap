import { AppDataSource } from '../db/data-source.js';
import { User } from '../entities/User.js';
import { Team } from '../entities/Team.js';
import { CheckIn } from '../entities/CheckIn.js';

export class MyCampaignService {
  private userRepo = AppDataSource.getRepository(User);
  private teamRepo = AppDataSource.getRepository(Team);
  private checkInRepo = AppDataSource.getRepository(CheckIn);

  /**
   * Chiến dịch của TNV hiện tại, suy ra qua account -> user -> team -> campaign.
   * Trả null nếu user chưa được gán vào team/chiến dịch nào.
   */
  async getMyCampaign(accId: number) {
    const user = await this.userRepo.findOne({
      where: { account: { accId } },
      relations: { team: { campaign: true } },
    });

    let team = user?.team;

    if (!team && user) {
      team = await this.teamRepo.findOne({
        where: { leader: { userId: user.userId }, isDeleted: 0 },
        relations: { campaign: true },
      }) ?? undefined;

      if (team) {
        user.team = team;
        await this.userRepo.save(user);
      }
    }

    if (!team?.campaign) {
      return null;
    }

    const resolvedTeam = team;
    const campaign = resolvedTeam.campaign;

    const checkIn = await this.checkInRepo.findOne({
      where: { campaignId: campaign.campaignId, accId },
      order: { checkedInAt: 'DESC' },
    });

    // Điểm danh là MỖI NGÀY MỘT LẦN: chỉ coi là đã điểm danh khi lần điểm danh
    // gần nhất rơi vào hôm nay. Dùng đúng biểu thức ngày như checkinService để
    // hai service chia sẻ cùng ngữ nghĩa ngày/timezone.
    const today = new Date().toISOString().split('T')[0];
    const checkedInToday = checkIn != null && checkIn.checkedInAt.startsWith(today);

    return {
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      description: campaign.description ?? null,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      latitude: campaign.latitude ?? null,
      longitude: campaign.longitude ?? null,
      checkInRadius: campaign.checkInRadius ?? null,
      teamId: resolvedTeam.teamId,
      teamName: resolvedTeam.teamName,
      teamCheckInLatitude: resolvedTeam.checkInLatitude ?? null,
      teamCheckInLongitude: resolvedTeam.checkInLongitude ?? null,
      teamCheckInRadius: resolvedTeam.checkInRadius ?? null,
      hasCheckedIn: checkedInToday,
      checkedInAt: checkedInToday ? checkIn!.checkedInAt : null,
    };
  }
}
