export interface Post {
  postId: number;
  title: string;
  content: string;
  photos?: string[];
  teamName: string;
  isDeleted: number;
  createdAt: string;
  location?: string;
}

export interface PostSummary {
  postId: number;
  title: string;
  content: string;
  teamName: string;
  firstPhoto?: string;
  location?: string;
}

export const mockPosts: Post[] = [
  {
    postId: 1,
    title:
      "Chào xuân 2026: Hành trình tình nguyện và sẻ chia yêu thương cùng UIT Volunteer Map ",
    content: `Đây là caption bài post \n Text dài thì phần này scroll riêng giống Instagram. #react #tailwind #instagramUI. \nNội dung mẫu: \nMùa xuân luôn mang đến những khởi đầu mới, và năm 2026 này, UIT Volunteer Map hân hạnh đồng hành cùng các bạn sinh viên trong hành trình tình nguyện đầy ý nghĩa. 🌸✨\n\nTrong dịp Tết Nguyên Đán, chúng ta không chỉ đón chào năm mới mà còn có cơ hội lan tỏa yêu thương đến những hoàn cảnh khó khăn xung quanh. Hãy cùng nhau tham gia các hoạt động tình nguyện như thăm hỏi người già neo đơn, hỗ trợ trẻ em mồ côi, và góp phần làm đẹp cộng đồng.\n\nUIT Volunteer Map sẽ là cầu nối giúp bạn tìm kiếm các dự án tình nguyện phù hợp với sở thích và khả năng của mình. Hãy đăng ký ngay hôm nay để trở thành một phần của cộng đồng tình nguyện viên năng động và nhiệt huyết! 💪🌍\n\nCùng nhau, chúng ta sẽ tạo nên những kỷ niệm đáng nhớ và mang lại niềm vui cho những người cần sự giúp đỡ. Chúc mọi người một năm mới an khang thịnh vượng và tràn đầy hạnh phúc! 🎉🎊`,
    photos: [
      "https://picsum.photos/id/1015/800/800",
      "https://picsum.photos/id/1016/800/800",
      "https://picsum.photos/id/1018/800/800",
    ],
    teamName: "Vị Xuân",
    isDeleted: 0,
    createdAt: "2026-01-20T10:00:00Z",
    location: "Hà Nội",
  },
  {
    postId: 2,
    title: "Hành trình mùa xuân: Lan tỏa yêu thương cùng UIT Volunteer Map",
    content: `Đây là caption bài post \n Text dài thì phần này scroll riêng giống Instagram. #react #tailwind #instagramUI. \nNội dung mẫu: \nMùa xuân là thời điểm tuyệt vời để chúng ta cùng nhau lan tỏa yêu thương và sẻ chia niềm vui với cộng đồng. Năm 2026, UIT Volunteer Map tiếp tục đồng hành cùng các bạn sinh viên trong những hoạt động tình nguyện ý nghĩa, mang lại niềm hạnh phúc cho những hoàn cảnh khó khăn.\n\nHãy tham gia các chiến dịch tình nguyện như thăm hỏi người già neo đơn, hỗ trợ trẻ em mồ côi, và góp phần làm đẹp cộng đồng. Mỗi hành động nhỏ đều có thể tạo nên sự khác biệt lớn trong cuộc sống của những người cần giúp đỡ.\n\nUIT Volunteer Map sẽ giúp bạn kết nối với các dự án tình nguyện phù hợp với sở thích và khả năng của mình. Đăng ký ngay hôm nay để trở thành một phần của cộng đồng tình nguyện viên nhiệt huyết và đầy năng lượng! 💪🌍\n\nCùng nhau, chúng ta sẽ tạo nên những kỷ niệm đáng nhớ và mang lại niềm vui cho những người xung quanh. Chúc mọi người một năm mới an khang thịnh vượng và tràn đầy hạnh phúc! 🎉🎊`,
    photos: [
      "https://picsum.photos/id/1020/800/800",
      "https://picsum.photos/id/1024/800/800",
      "https://picsum.photos/id/1027/800/800",
    ],
    teamName: "Nhịp Xuân",
    isDeleted: 0,
    createdAt: "2026-01-22T15:30:00Z",
    location: "TP.HCM",
  },
];

export const mockPostsSummary: PostSummary[] = mockPosts.map((post) => ({
  postId: post.postId,
  title: post.title,
  content: post.content,
  teamName: post.teamName,
  firstPhoto: post.photos ? post.photos[0] : undefined,
  location: post.location,
}));