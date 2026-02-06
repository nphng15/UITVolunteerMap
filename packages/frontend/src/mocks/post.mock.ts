export interface Post {
  id: number | string;
  title: string;
  caption: string;
  images: string[];
  createdAt: string;
  location?: string;
}

export const mockPost: Post = {
  id: 1,
  title: "Chào xuân 2026",
  caption: `Đây là caption bài post
Text dài thì phần này scroll riêng giống Instagram.

#react #tailwind #instagramUI`,
  images: [
    "https://picsum.photos/id/1015/800/800",
    "https://picsum.photos/id/1016/800/800",
    "https://picsum.photos/id/1018/800/800",
  ],
  createdAt: "2026-01-20T10:00:00Z",
  location: "Hà Nội",
};
