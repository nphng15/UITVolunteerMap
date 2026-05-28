import { DataSource } from "typeorm";
import { Campaign } from "../../entities/Campaign.js";

const testCampaigns = [
  {
    campaignName: "Mùa Hè Xanh 2026",
    description:
      "Chiến dịch tình nguyện hè tại Linh Trung, Củ Chi và các địa bàn vùng ven.",
    startDate: "2026-06-01",
    endDate: "2026-08-30",
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
    } else {
      campaign = repo.create(data);
    }
    await repo.save(campaign);
  }

  console.log("Campaigns seeded: Mùa Hè Xanh 2026, Xuân Tình Nguyện 2026");
};
