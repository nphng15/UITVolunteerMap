import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { RoleEnum } from "@uit-volunteer-map/shared";
import { Account } from "../../entities/Account.js";
import { Role } from "../../entities/Role.js";
import { User } from "../../entities/User.js";
import { Team } from "../../entities/Team.js";

interface VolunteerSeed {
  username: string;
  password: string;
  fullName: string;
  email: string;
  mssv: string;
  class: string;
  phoneNumber: string;
  teamName: string;
}

const volunteers: VolunteerSeed[] = [
  {
    username: "volunteer",
    password: "volunteer123",
    fullName: "Nguyễn Tình Nguyện",
    email: "volunteer@test.local",
    mssv: "21520999",
    class: "Khoa Khoa học Máy tính - KHMT2021",
    phoneNumber: "0905123456",
    teamName: "Đội hình Máy tính cũ",
  },
  {
    username: "volunteer_mtc_01",
    password: "volunteer123",
    fullName: "Trần Minh Phúc",
    email: "volunteer.mtc01@test.local",
    mssv: "21520111",
    class: "Khoa Kỹ thuật Máy tính - KTMT2021",
    phoneNumber: "0911002001",
    teamName: "Đội hình Máy tính cũ",
  },
  {
    username: "volunteer_mtc_02",
    password: "volunteer123",
    fullName: "Lê Hoàng Yến",
    email: "volunteer.mtc02@test.local",
    mssv: "22520112",
    class: "Khoa Công nghệ Phần mềm - CNPM2022",
    phoneNumber: "0911002002",
    teamName: "Đội hình Máy tính cũ",
  },
  {
    username: "volunteer_sx_01",
    password: "volunteer123",
    fullName: "Phạm Quốc Việt",
    email: "volunteer.sx01@test.local",
    mssv: "21520211",
    class: "Khoa Mạng máy tính và Truyền thông - MMT2021",
    phoneNumber: "0911002011",
    teamName: "Đội hình Sắc Xanh",
  },
  {
    username: "volunteer_sx_02",
    password: "volunteer123",
    fullName: "Đỗ Ngọc Mai",
    email: "volunteer.sx02@test.local",
    mssv: "22520212",
    class: "Khoa Khoa học và Kỹ thuật Thông tin - KHKT2022",
    phoneNumber: "0911002012",
    teamName: "Đội hình Sắc Xanh",
  },
  {
    username: "volunteer_ngm_01",
    password: "volunteer123",
    fullName: "Huỳnh Gia Bảo",
    email: "volunteer.ngm01@test.local",
    mssv: "21520311",
    class: "Khoa Hệ thống Thông tin - HTTT2021",
    phoneNumber: "0911002021",
    teamName: "Đội hình Nắng Gieo Màu",
  },
  {
    username: "volunteer_ngm_02",
    password: "volunteer123",
    fullName: "Nguyễn Thảo My",
    email: "volunteer.ngm02@test.local",
    mssv: "22520312",
    class: "Khoa Khoa học Máy tính - KHMT2022",
    phoneNumber: "0911002022",
    teamName: "Đội hình Nắng Gieo Màu",
  },
  {
    username: "volunteer_vn_01",
    password: "volunteer123",
    fullName: "Võ Anh Kiệt",
    email: "volunteer.vn01@test.local",
    mssv: "21520411",
    class: "Khoa Công nghệ Phần mềm - CNPM2021",
    phoneNumber: "0911002031",
    teamName: "Đội hình Văn nghệ",
  },
  {
    username: "volunteer_vn_02",
    password: "volunteer123",
    fullName: "Bùi Thanh Hằng",
    email: "volunteer.vn02@test.local",
    mssv: "22520412",
    class: "Khoa Hệ thống Thông tin - HTTT2022",
    phoneNumber: "0911002032",
    teamName: "Đội hình Văn nghệ",
  },
  {
    username: "volunteer_xcn_01",
    password: "volunteer123",
    fullName: "Ngô Đức Toàn",
    email: "volunteer.xcn01@test.local",
    mssv: "22520511",
    class: "Khoa Khoa học Máy tính - KHMT2022",
    phoneNumber: "0911002041",
    teamName: "Đội hình Xuân Công Nghệ",
  },
  {
    username: "volunteer_xcn_02",
    password: "volunteer123",
    fullName: "Trương Mỹ Linh",
    email: "volunteer.xcn02@test.local",
    mssv: "23520512",
    class: "Khoa Kỹ thuật Máy tính - KTMT2023",
    phoneNumber: "0911002042",
    teamName: "Đội hình Xuân Công Nghệ",
  },
  {
    username: "volunteer_vx_01",
    password: "volunteer123",
    fullName: "Lâm Hải Đăng",
    email: "volunteer.vx01@test.local",
    mssv: "22520611",
    class: "Khoa Mạng máy tính và Truyền thông - MMT2022",
    phoneNumber: "0911002051",
    teamName: "Đội hình Vì Xuân",
  },
  {
    username: "volunteer_vx_02",
    password: "volunteer123",
    fullName: "Nguyễn Phương Uyên",
    email: "volunteer.vx02@test.local",
    mssv: "23520612",
    class: "Khoa Hệ thống Thông tin - HTTT2023",
    phoneNumber: "0911002052",
    teamName: "Đội hình Vì Xuân",
  },
  {
    username: "volunteer_nx_01",
    password: "volunteer123",
    fullName: "Phan Nhật Tân",
    email: "volunteer.nx01@test.local",
    mssv: "22520711",
    class: "Khoa Công nghệ Phần mềm - CNPM2022",
    phoneNumber: "0911002061",
    teamName: "Đội hình Nhịp Xuân",
  },
  {
    username: "volunteer_nx_02",
    password: "volunteer123",
    fullName: "Đặng Ngọc Trâm",
    email: "volunteer.nx02@test.local",
    mssv: "23520712",
    class: "Khoa Khoa học và Kỹ thuật Thông tin - KHKT2023",
    phoneNumber: "0911002062",
    teamName: "Đội hình Nhịp Xuân",
  },
  {
    username: "volunteer_tt_01",
    password: "volunteer123",
    fullName: "Hoàng Minh Châu",
    email: "volunteer.tt01@test.local",
    mssv: "22520811",
    class: "Khoa Mạng máy tính và Truyền thông - MMT2022",
    phoneNumber: "0911002071",
    teamName: "Đội hình Truyền thông",
  },
  {
    username: "volunteer_tt_02",
    password: "volunteer123",
    fullName: "Tạ Quang Huy",
    email: "volunteer.tt02@test.local",
    mssv: "23520812",
    class: "Khoa Kỹ thuật Máy tính - KTMT2023",
    phoneNumber: "0911002072",
    teamName: "Đội hình Truyền thông",
  },
];

export const seedVolunteers = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const accountRepo = dataSource.getRepository(Account);
  const userRepo = dataSource.getRepository(User);
  const teamRepo = dataSource.getRepository(Team);

  const role = await roleRepo.findOneBy({ roleName: RoleEnum.VOLUNTEER });
  if (!role) {
    throw new Error(`Missing role: ${RoleEnum.VOLUNTEER}`);
  }

  const passwordCache = new Map<string, string>();
  const now = new Date().toISOString();

  for (const volunteer of volunteers) {
    const team = await teamRepo.findOne({
      where: { teamName: volunteer.teamName },
    });
    if (!team) {
      throw new Error(`Missing team: ${volunteer.teamName}`);
    }

    let password = passwordCache.get(volunteer.password);
    if (!password) {
      password = await bcrypt.hash(volunteer.password, 10);
      passwordCache.set(volunteer.password, password);
    }

    let account = await accountRepo.findOne({
      where: { username: volunteer.username },
    });
    if (account) {
      account.password = password;
      account.roleId = role.roleId;
      account.updatedAt = now;
      account.isDeleted = false;
    } else {
      account = accountRepo.create({
        username: volunteer.username,
        password,
        roleId: role.roleId,
        createdAt: now,
        isDeleted: false,
      });
    }
    const savedAccount = await accountRepo.save(account);

    let user = await userRepo.findOne({
      where: { account: { accId: savedAccount.accId } },
      relations: { account: true },
    });
    if (user) {
      user.fullName = volunteer.fullName;
      user.email = volunteer.email;
      user.mssv = volunteer.mssv;
      user.class = volunteer.class;
      user.phoneNumber = volunteer.phoneNumber;
      user.isDeleted = 0;
      user.account = savedAccount;
      user.team = team;
    } else {
      user = userRepo.create({
        fullName: volunteer.fullName,
        email: volunteer.email,
        mssv: volunteer.mssv,
        class: volunteer.class,
        phoneNumber: volunteer.phoneNumber,
        isDeleted: 0,
        account: savedAccount,
        team,
      });
    }
    await userRepo.save(user);
  }

  console.log(`Volunteers seeded: ${volunteers.length} accounts (password: volunteer123)`);
};
