import "dotenv/config";
import "reflect-metadata";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DataSource } from "typeorm";
import { cloudinary } from "../config/cloudinary.js";
import { AppDataSource } from "../db/data-source.js";
import { seedVolunteers } from "../db/seeds/volunteers.seed.js";
import { Account } from "../entities/Account.js";
import { Attachment } from "../entities/Attachment.js";
import { Campaign } from "../entities/Campaign.js";
import { CampaignPhoto } from "../entities/CampaignPhoto.js";
import { Photo } from "../entities/Photo.js";
import { Post } from "../entities/Post.js";
import { Team } from "../entities/Team.js";
import { User } from "../entities/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_ASSETS_DIR = join(__dirname, "../db/sample-assets");
const ASSETS_DIR = process.env.ANDROID_ASSETS_DIR || DEFAULT_ASSETS_DIR;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_SAMPLE_FOLDER || "uit-volunteer-map/sample-data";

type AssetKey =
  | "mxhBanner"
  | "mxhMayTinhCu"
  | "mxhSacXanh"
  | "mxhNangGieoMau"
  | "mxhVanNghe"
  | "mxhPost1"
  | "mxhPost2"
  | "mxhPost3"
  | "mxhPost4"
  | "mxhPost5"
  | "mxhLeader"
  | "xtnBanner"
  | "xtnXuanCongNghe"
  | "xtnViXuan"
  | "xtnNhipXuan"
  | "xtnTruyenThong"
  | "xtnPost1"
  | "xtnPost2"
  | "xtnPost3"
  | "xtnPost4"
  | "xtnPost5"
  | "xtnLeader"
  | "xtnLeader2";

const assets: Record<AssetKey, { relativePath: string; publicId: string }> = {
  mxhBanner: { relativePath: "MXH2025/AvatarChienDich_Banner.jpg", publicId: "mxh-2025/banner" },
  mxhMayTinhCu: { relativePath: "MXH2025/DoiHinhMayTinhCu.jpg", publicId: "mxh-2025/teams/may-tinh-cu" },
  mxhSacXanh: { relativePath: "MXH2025/DoiHinhSacXanh.jpg", publicId: "mxh-2025/teams/sac-xanh" },
  mxhNangGieoMau: { relativePath: "MXH2025/DoiHinhNangGieoMau.jpg", publicId: "mxh-2025/teams/nang-gieo-mau" },
  mxhVanNghe: { relativePath: "MXH2025/DoiHinhVanNghe.jpg", publicId: "mxh-2025/teams/van-nghe" },
  mxhPost1: { relativePath: "MXH2025/AnhBaiViet.jpg", publicId: "mxh-2025/posts/01-may-tinh-cu" },
  mxhPost2: { relativePath: "MXH2025/AnhBaiViet2.jpg", publicId: "mxh-2025/posts/02-sac-xanh" },
  mxhPost3: { relativePath: "MXH2025/AnhBaiViet5.jpg", publicId: "mxh-2025/posts/03-nang-gieo-mau" },
  mxhPost4: { relativePath: "MXH2025/AnhBaiViet8.jpg", publicId: "mxh-2025/posts/04-van-nghe" },
  mxhPost5: { relativePath: "MXH2025/AnhBaiViet10.jpg", publicId: "mxh-2025/posts/05-tong-ket" },
  mxhLeader: { relativePath: "MXH2025/AnhChiHuy(Leader).jpg", publicId: "mxh-2025/leaders/chi-huy" },
  xtnBanner: { relativePath: "XTN2026/XuanTinhNguyen_Banner.jpg", publicId: "xtn-2026/banner" },
  xtnXuanCongNghe: { relativePath: "XTN2026/DoiHinhXuanCongNghe.jpg", publicId: "xtn-2026/teams/xuan-cong-nghe" },
  xtnViXuan: { relativePath: "XTN2026/DoiHinhViXuan.jpg", publicId: "xtn-2026/teams/vi-xuan" },
  xtnNhipXuan: { relativePath: "XTN2026/DoiHinhNhipXuan.jpg", publicId: "xtn-2026/teams/nhip-xuan" },
  xtnTruyenThong: { relativePath: "XTN2026/DoiHinhTruyenThong.jpg", publicId: "xtn-2026/teams/truyen-thong" },
  xtnPost1: { relativePath: "XTN2026/AnhBaiViet1.jpg", publicId: "xtn-2026/posts/01-vi-xuan" },
  xtnPost2: { relativePath: "XTN2026/BaiViet2.jpg", publicId: "xtn-2026/posts/02-xuan-cong-nghe" },
  xtnPost3: { relativePath: "XTN2026/BaiViet5.jpg", publicId: "xtn-2026/posts/03-nhip-xuan" },
  xtnPost4: { relativePath: "XTN2026/BaiViet4.jpg", publicId: "xtn-2026/posts/04-truyen-thong" },
  xtnPost5: { relativePath: "XTN2026/BaiViet6.jpg", publicId: "xtn-2026/posts/05-tong-ket" },
  xtnLeader: { relativePath: "XTN2026/ChiHuy.jpg", publicId: "xtn-2026/leaders/chi-huy-1" },
  xtnLeader2: { relativePath: "XTN2026/ChiHuy2.jpg", publicId: "xtn-2026/leaders/chi-huy-2" },
};

type UploadedUrls = Record<AssetKey, string>;

interface TeamSeed {
  teamName: string;
  description: string;
  campaignName: string;
  leaderUsername: string;
  imageKey: AssetKey;
  attachmentKeys: AssetKey[];
  leaderAvatarKey: AssetKey;
  checkInLatitude?: number;
  checkInLongitude?: number;
}

interface PostSeed {
  title: string;
  content: string;
  teamName: string;
  authorUsername: string;
  imageKey: AssetKey;
  imageTitle: string;
}

const campaigns = [
  {
    campaignName: "Mùa Hè Xanh 2026",
    description:
      "Chiến dịch hè với các đội hình công nghệ, môi trường, văn nghệ và hoạt động cộng đồng tại nhiều địa bàn.",
    startDate: "2026-06-01",
    endDate: "2026-08-30",
    bannerKey: "mxhBanner" as AssetKey,
    latitude: 10.8700,
    longitude: 106.8030,
    checkInRadius: 150,
  },
  {
    campaignName: "Xuân Tình Nguyện 2026",
    description:
      "Chiến dịch xuân tập trung chăm lo Tết, thăm mái ấm, tổ chức sân chơi thiếu nhi và hỗ trợ cộng đồng bằng công nghệ.",
    startDate: "2026-01-05",
    endDate: "2026-01-25",
    bannerKey: "xtnBanner" as AssetKey,
    latitude: 10.8700,
    longitude: 106.8030,
    checkInRadius: 150,
  },
];

const teams: TeamSeed[] = [
  {
    teamName: "Đội hình Máy tính cũ",
    description: "Kiểm tra, vệ sinh và cài đặt lại máy tính cũ để tạo phòng học công nghệ cho thiếu nhi địa phương.",
    campaignName: "Mùa Hè Xanh 2026",
    leaderUsername: "leader_mtc",
    imageKey: "mxhMayTinhCu",
    attachmentKeys: ["mxhMayTinhCu", "mxhPost1", "mxhPost5"],
    leaderAvatarKey: "mxhLeader",
    checkInLatitude: 10.8704,
    checkInLongitude: 106.8032,
  },
  {
    teamName: "Đội hình Sắc Xanh",
    description: "Triển khai hoạt động môi trường, làm sạch tuyến đường, phân loại rác và tạo thêm mảng xanh.",
    campaignName: "Mùa Hè Xanh 2026",
    leaderUsername: "leader_sx",
    imageKey: "mxhSacXanh",
    attachmentKeys: ["mxhSacXanh", "mxhPost2", "mxhPost4"],
    leaderAvatarKey: "mxhLeader",
  },
  {
    teamName: "Đội hình Nắng Gieo Màu",
    description: "Tổ chức lớp kỹ năng, hoạt động mỹ thuật và sân chơi mùa hè cho các em nhỏ.",
    campaignName: "Mùa Hè Xanh 2026",
    leaderUsername: "leader_ngm",
    imageKey: "mxhNangGieoMau",
    attachmentKeys: ["mxhNangGieoMau", "mxhPost3", "mxhPost5"],
    leaderAvatarKey: "mxhLeader",
  },
  {
    teamName: "Đội hình Văn nghệ",
    description: "Chuẩn bị tiết mục giao lưu, sân khấu nhỏ và hoạt động kết nối cộng đồng trong ngày cao điểm.",
    campaignName: "Mùa Hè Xanh 2026",
    leaderUsername: "leader_vn",
    imageKey: "mxhVanNghe",
    attachmentKeys: ["mxhVanNghe", "mxhPost4", "mxhPost5"],
    leaderAvatarKey: "mxhLeader",
  },
  {
    teamName: "Đội hình Xuân Công Nghệ",
    description: "Hỗ trợ người dân cài đặt ứng dụng, vệ sinh thiết bị và hướng dẫn sử dụng dịch vụ số.",
    campaignName: "Xuân Tình Nguyện 2026",
    leaderUsername: "leader_xcn",
    imageKey: "xtnXuanCongNghe",
    attachmentKeys: ["xtnXuanCongNghe", "xtnPost2", "xtnPost5"],
    leaderAvatarKey: "xtnLeader",
  },
  {
    teamName: "Đội hình Vì Xuân",
    description: "Thăm hỏi gia đình khó khăn, chuẩn bị quà Tết và ghi nhận câu chuyện sẻ chia trước năm mới.",
    campaignName: "Xuân Tình Nguyện 2026",
    leaderUsername: "leader_vx",
    imageKey: "xtnViXuan",
    attachmentKeys: ["xtnViXuan", "xtnPost1", "xtnPost5"],
    leaderAvatarKey: "xtnLeader2",
  },
  {
    teamName: "Đội hình Nhịp Xuân",
    description: "Tổ chức sân chơi thiếu nhi, trò chơi dân gian và góc tô màu để mang không khí Tết đến các em nhỏ.",
    campaignName: "Xuân Tình Nguyện 2026",
    leaderUsername: "leader_nx",
    imageKey: "xtnNhipXuan",
    attachmentKeys: ["xtnNhipXuan", "xtnPost3", "xtnPost5"],
    leaderAvatarKey: "xtnLeader",
  },
  {
    teamName: "Đội hình Truyền thông",
    description: "Ghi nhận hình ảnh, viết bài cập nhật nhanh và tổng hợp khoảnh khắc nổi bật của chiến dịch.",
    campaignName: "Xuân Tình Nguyện 2026",
    leaderUsername: "leader_tt",
    imageKey: "xtnTruyenThong",
    attachmentKeys: ["xtnTruyenThong", "xtnPost4", "xtnPost5"],
    leaderAvatarKey: "xtnLeader2",
  },
];

const posts: PostSeed[] = [
  {
    title: "Một buổi làm mới phòng máy cho các em nhỏ",
    content: "Cả đội kiểm tra từng bộ máy, vệ sinh linh kiện và cài lại phần mềm học tập để phòng máy sẵn sàng cho lớp tin học hè.",
    teamName: "Đội hình Máy tính cũ",
    authorUsername: "leader_mtc",
    imageKey: "mxhPost1",
    imageTitle: "Phòng máy sau khi được làm mới",
  },
  {
    title: "Tuyến đường xanh sau một buổi ra quân",
    content: "Từ sáng sớm, các bạn chia nhóm quét dọn, phân loại rác và trồng thêm mảng xanh nhỏ ở khu dân cư.",
    teamName: "Đội hình Sắc Xanh",
    authorUsername: "leader_sx",
    imageKey: "mxhPost2",
    imageTitle: "Tuyến đường xanh",
  },
  {
    title: "Lớp kỹ năng nhỏ, tiếng cười rất lớn",
    content: "Buổi sinh hoạt thiếu nhi kết thúc bằng phần vẽ tranh về mùa hè xanh, mỗi bức tranh là một câu chuyện các em muốn kể.",
    teamName: "Đội hình Nắng Gieo Màu",
    authorUsername: "leader_ngm",
    imageKey: "mxhPost3",
    imageTitle: "Sinh hoạt thiếu nhi",
  },
  {
    title: "Những phần quà đầu tiên đã đến tay bà con",
    content: "Đội hình hoàn tất tuyến thăm hỏi đầu tiên, trao quà Tết và ghi lại câu chuyện chuẩn bị năm mới của từng gia đình.",
    teamName: "Đội hình Vì Xuân",
    authorUsername: "leader_vx",
    imageKey: "xtnPost1",
    imageTitle: "Trao quà Tết",
  },
  {
    title: "Góc công nghệ nhỏ trong ngày hội xuân",
    content: "Các bạn hỗ trợ người dân cài đặt ứng dụng cần thiết, hướng dẫn tra cứu thông tin và vệ sinh thiết bị trước thềm năm mới.",
    teamName: "Đội hình Xuân Công Nghệ",
    authorUsername: "leader_xcn",
    imageKey: "xtnPost2",
    imageTitle: "Hỗ trợ công nghệ",
  },
  {
    title: "Sân chơi thiếu nhi rộn ràng sắc xuân",
    content: "Buổi sinh hoạt có trò chơi dân gian, góc tô màu và phần giao lưu văn nghệ giúp các em nhỏ cảm nhận không khí Tết sớm hơn.",
    teamName: "Đội hình Nhịp Xuân",
    authorUsername: "leader_nx",
    imageKey: "xtnPost3",
    imageTitle: "Sân chơi thiếu nhi",
  },
];

async function uploadAssets(): Promise<UploadedUrls> {
  if (!existsSync(ASSETS_DIR)) {
    throw new Error(`Assets directory not found: ${ASSETS_DIR}`);
  }

  const uploaded = {} as UploadedUrls;
  for (const [key, asset] of Object.entries(assets) as [AssetKey, (typeof assets)[AssetKey]][]) {
    const filePath = join(ASSETS_DIR, asset.relativePath);
    if (!existsSync(filePath)) {
      throw new Error(`Missing image asset: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `${CLOUDINARY_FOLDER}/${asset.publicId}`,
      overwrite: true,
      resource_type: "image",
    });
    uploaded[key] = result.secure_url;
    console.log(`Uploaded ${asset.relativePath} -> ${result.secure_url}`);
  }
  return uploaded;
}

async function findUserByUsername(dataSource: DataSource, username: string): Promise<User> {
  const user = await dataSource.getRepository(User).findOne({
    where: { account: { username } },
    relations: { account: true },
  });
  if (!user) throw new Error(`Missing user for account username=${username}. Run npm run seed first.`);
  return user;
}

async function findAccountByUsername(dataSource: DataSource, username: string): Promise<Account> {
  const account = await dataSource.getRepository(Account).findOne({ where: { username } });
  if (!account) throw new Error(`Missing account username=${username}. Run npm run seed first.`);
  return account;
}

async function hideLegacyDemoData(dataSource: DataSource): Promise<void> {
  const teamRepo = dataSource.getRepository(Team);
  const postRepo = dataSource.getRepository(Post);
  const photoRepo = dataSource.getRepository(Photo);

  const legacyTeams = await teamRepo
    .createQueryBuilder("team")
    .where("team.teamName LIKE :oldUitName", { oldUitName: "%UIT%" })
    .getMany();
  for (const team of legacyTeams) {
    team.isDeleted = 1;
    await teamRepo.save(team);
  }

  const legacyPosts = await postRepo
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.photos", "photo")
    .where("post.title NOT IN (:...activeTitles)", { activeTitles: posts.map((post) => post.title) })
    .getMany();
  for (const post of legacyPosts) {
    post.isDeleted = 1;
    await postRepo.save(post);
    for (const photo of post.photos ?? []) {
      photo.isDeleted = 1;
      await photoRepo.save(photo);
    }
  }

  console.log(`Legacy demo data hidden: ${legacyTeams.length} teams, ${legacyPosts.length} posts`);
}

async function upsertCampaigns(dataSource: DataSource, urls: UploadedUrls): Promise<void> {
  const campaignRepo = dataSource.getRepository(Campaign);
  const campaignPhotoRepo = dataSource.getRepository(CampaignPhoto);
  const admin = await findAccountByUsername(dataSource, "admin");
  const now = new Date().toISOString();

  for (const data of campaigns) {
    let campaign = await campaignRepo.findOne({ where: { campaignName: data.campaignName } });
    if (!campaign) {
      campaign = campaignRepo.create({ campaignName: data.campaignName });
    }
    campaign.description = data.description;
    campaign.startDate = data.startDate;
    campaign.endDate = data.endDate;
    campaign.latitude = data.latitude;
    campaign.longitude = data.longitude;
    campaign.checkInRadius = data.checkInRadius;
    campaign = await campaignRepo.save(campaign);

    let campaignPhoto = await campaignPhotoRepo.findOne({
      where: { campaignId: campaign.campaignId, caption: `${data.campaignName} banner` },
    });
    if (!campaignPhoto) {
      campaignPhoto = campaignPhotoRepo.create({
        campaignId: campaign.campaignId,
        accId: admin.accId,
        caption: `${data.campaignName} banner`,
        createdAt: now,
      });
    }
    campaignPhoto.imageUrl = urls[data.bannerKey];
    campaignPhoto.isCheckinPhoto = 0;
    campaignPhoto.isDeleted = 0;
    campaignPhoto.createdAt = campaignPhoto.createdAt || now;
    await campaignPhotoRepo.save(campaignPhoto);
  }
  console.log(`Campaigns/images seeded: ${campaigns.length}`);
}

async function upsertTeams(dataSource: DataSource, urls: UploadedUrls): Promise<void> {
  const teamRepo = dataSource.getRepository(Team);
  const campaignRepo = dataSource.getRepository(Campaign);
  const userRepo = dataSource.getRepository(User);
  const attachmentRepo = dataSource.getRepository(Attachment);

  for (const data of teams) {
    const campaign = await campaignRepo.findOne({ where: { campaignName: data.campaignName } });
    if (!campaign) throw new Error(`Missing campaign: ${data.campaignName}`);
    const leader = await findUserByUsername(dataSource, data.leaderUsername);

    let team = await teamRepo.findOne({ where: { teamName: data.teamName } });
    if (!team) team = teamRepo.create({ teamName: data.teamName });

    team.description = data.description;
    team.imageUrl = urls[data.imageKey];
    team.isDeleted = 0;
    team.leader = leader;
    team.campaign = campaign;
    team.checkInLatitude = data.checkInLatitude ?? null;
    team.checkInLongitude = data.checkInLongitude ?? null;
    team.checkInRadius = data.checkInLatitude != null && data.checkInLongitude != null ? 100 : null;

    const saved = await teamRepo.save(team);
    leader.avatarUrl = urls[data.leaderAvatarKey];
    leader.team = saved;
    await userRepo.save(leader);

    for (const [index, key] of data.attachmentKeys.entries()) {
      const imageUrl = urls[key];
      let attachment = await attachmentRepo.findOne({ where: { imageUrl } });
      if (!attachment) {
        attachment = attachmentRepo.create({ imageUrl, uploadedAt: new Date().toISOString() });
      }
      attachment.position = index;
      attachment.team = saved;
      await attachmentRepo.save(attachment);
    }
  }
  console.log(`Teams/images/attachments seeded: ${teams.length}`);
}

async function upsertPosts(dataSource: DataSource, urls: UploadedUrls): Promise<void> {
  const postRepo = dataSource.getRepository(Post);
  const photoRepo = dataSource.getRepository(Photo);
  const teamRepo = dataSource.getRepository(Team);
  const now = new Date().toISOString();

  for (const data of posts) {
    const team = await teamRepo.findOne({ where: { teamName: data.teamName } });
    if (!team) throw new Error(`Missing team: ${data.teamName}`);
    const author = await findUserByUsername(dataSource, data.authorUsername);

    let post = await postRepo.findOne({ where: { title: data.title }, relations: { photos: true } });
    if (!post) {
      post = postRepo.create({
        title: data.title,
        createdAt: now,
      });
    }
    post.content = data.content;
    post.updatedAt = now;
    post.isDeleted = 0;
    post.team = team;
    post.author = author;
    post = await postRepo.save(post);

    const imageUrl = urls[data.imageKey];
    let photo = await photoRepo.findOne({ where: { imageUrl } });
    if (!photo) {
      photo = photoRepo.create({ imageUrl, uploadedAt: now });
    }
    photo.title = data.imageTitle;
    photo.uploadedAt = photo.uploadedAt || now;
    photo.isFirstImage = 1;
    photo.isDeleted = 0;
    photo.post = post;
    await photoRepo.save(photo);
  }
  console.log(`Posts/photos seeded: ${posts.length}`);
}

export async function seedRemoteImages(dataSource: DataSource): Promise<void> {
  if (!process.env.CLOUDINARY_URL) {
    console.warn("CLOUDINARY_URL is not set; skipping remote image sample data seed.");
    return;
  }

  const urls = await uploadAssets();
  await hideLegacyDemoData(dataSource);
  await upsertCampaigns(dataSource, urls);
  await upsertTeams(dataSource, urls);
  await seedVolunteers(dataSource);
  await upsertPosts(dataSource, urls);
  console.log("Remote image sample data seed completed.");
}

async function main() {
  await AppDataSource.initialize();
  try {
    await seedRemoteImages(AppDataSource);
  } finally {
    await AppDataSource.destroy();
  }
}

const executedPath = process.argv[1] ? fileURLToPath(new URL(`file://${process.argv[1]}`)) : "";
if (executedPath === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
