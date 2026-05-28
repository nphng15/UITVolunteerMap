import { DataSource } from "typeorm";
import { Photo } from "../../entities/Photo.js";
import { Post } from "../../entities/Post.js";
import { Team } from "../../entities/Team.js";
import { User } from "../../entities/User.js";

interface SeedPost {
  title: string;
  content: string;
  teamName: string;
  authorUsername: string;
  photos: { title: string; imageUrl: string; isFirstImage: number }[];
}

const testPosts: SeedPost[] = [
  {
    title: "Khởi động Mùa Hè Xanh 2026 tại Linh Trung",
    content:
      "Đội UIT 1 ra quân ngày đầu tiên, dọn dẹp khuôn viên trường tiểu học Linh Trung và phát quà cho học sinh có hoàn cảnh khó khăn.",
    teamName: "Đội Mùa Hè Xanh - UIT 1",
    authorUsername: "leader",
    photos: [
      {
        title: "Lễ ra quân",
        imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/posts/p1-1.jpg",
        isFirstImage: 1,
      },
      {
        title: "Phát quà cho học sinh",
        imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/posts/p1-2.jpg",
        isFirstImage: 0,
      },
    ],
  },
  {
    title: "Sửa chữa đường giao thông tại Củ Chi",
    content:
      "Đội UIT 2 phối hợp với đoàn xã sửa 200m đường liên ấp, sơn lại biển báo và phát áo phản quang cho học sinh đi học sớm.",
    teamName: "Đội Mùa Hè Xanh - UIT 2",
    authorUsername: "leader2",
    photos: [
      {
        title: "Sửa đường",
        imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/posts/p2-1.jpg",
        isFirstImage: 1,
      },
    ],
  },
  {
    title: "Đêm văn nghệ giao lưu cùng bà con",
    content:
      "Tối thứ Bảy, các bạn tình nguyện viên tổ chức đêm văn nghệ tại nhà văn hoá ấp với 12 tiết mục cây nhà lá vườn.",
    teamName: "Đội Mùa Hè Xanh - UIT 1",
    authorUsername: "leader",
    photos: [
      {
        title: "Sân khấu đêm văn nghệ",
        imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/posts/p3-1.jpg",
        isFirstImage: 1,
      },
    ],
  },
];

export const seedPosts = async (dataSource: DataSource) => {
  const postRepo = dataSource.getRepository(Post);
  const photoRepo = dataSource.getRepository(Photo);
  const teamRepo = dataSource.getRepository(Team);
  const userRepo = dataSource.getRepository(User);

  for (const data of testPosts) {
    const team = await teamRepo.findOne({ where: { teamName: data.teamName } });
    if (!team) throw new Error(`Missing team: ${data.teamName}`);

    const author = await userRepo.findOne({
      where: { account: { username: data.authorUsername } },
      relations: { account: true },
    });
    if (!author) throw new Error(`Missing author user: ${data.authorUsername}`);

    const existing = await postRepo.findOne({
      where: { title: data.title },
      relations: { photos: true },
    });
    if (existing) continue;

    const now = new Date().toISOString();
    const post = await postRepo.save(
      postRepo.create({
        title: data.title,
        content: data.content,
        team,
        author,
        isDeleted: 0,
        createdAt: now,
        updatedAt: now,
      }),
    );

    for (const photo of data.photos) {
      await photoRepo.save(
        photoRepo.create({
          title: photo.title,
          imageUrl: photo.imageUrl,
          uploadedAt: now,
          isFirstImage: photo.isFirstImage,
          isDeleted: 0,
          post,
        }),
      );
    }
  }

  console.log(`Posts seeded: ${testPosts.length} bài viết mẫu`);
};
