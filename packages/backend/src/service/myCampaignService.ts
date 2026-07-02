import { AppDataSource } from '../db/data-source.js';
import { User } from '../entities/User.js';
import { CheckIn } from '../entities/CheckIn.js';

export class MyCampaignService {
  private userRepo = AppDataSource.getRepository(User);
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

    const campaign = user?.team?.campaign;
    if (!campaign) {
      return null;
    }

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
      teamId: user!.team.teamId,
      teamName: user!.team.teamName,
      teamCheckInLatitude: user!.team.checkInLatitude ?? null,
      teamCheckInLongitude: user!.team.checkInLongitude ?? null,
      teamCheckInRadius: user!.team.checkInRadius ?? null,
      hasCheckedIn: checkedInToday,
      checkedInAt: checkedInToday ? checkIn!.checkedInAt : null,
    };
  }
}
