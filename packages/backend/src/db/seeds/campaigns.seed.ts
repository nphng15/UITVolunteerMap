import { DataSource } from "typeorm";
import { Campaign } from "../../entities/Campaign.js";

const testCampaigns = [
  {
    campaignName: "Mùa Hè Xanh 2026",
    description:
      "Chiến dịch tình nguyện hè tại Linh Trung, Củ Chi và các địa bàn vùng ven.",
    startDate: "2026-06-01",
    endDate: "2026-08-30",
    // Toạ độ UIT (Khu phố 6, Linh Trung, Thủ Đức) để test điểm danh GPS.
    latitude: 10.8700,
    longitude: 106.8030,
    checkInRadius: 150,
  },
  {
    campaignName: "Xuân Tình Nguyện 2026",
    description:
      "Chiến dịch xuân chăm lo cộng đồng, mái ấm và hoạt động an sinh dịp Tết.",
    startDate: "2026-01-05",
    endDate: "2026-01-25",
  },
];

export const seedCampaigns = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Campaign);

  for (const data of testCampaigns) {
    let campaign = await repo.findOne({
      where: { campaignName: data.campaignName },
    });
    if (campaign) {
      campaign.description = data.description;
      campaign.startDate = data.startDate;
      campaign.endDate = data.endDate;
      campaign.latitude = data.latitude ?? null;
      campaign.longitude = data.longitude ?? null;
      if (data.checkInRadius != null) {
        campaign.checkInRadius = data.checkInRadius;
      }
    } else {
      campaign = repo.create(data);
    }
    await repo.save(campaign);
  }

  console.log("Campaigns seeded: Mùa Hè Xanh 2026, Xuân Tình Nguyện 2026");
};
