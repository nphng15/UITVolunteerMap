import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { RoleEnum } from "@uit-volunteer-map/shared";
import { Account } from "../../entities/Account.js";
import { Role } from "../../entities/Role.js";
import { User } from "../../entities/User.js";

interface AccountSeed {
  username: string;
  password: string;
  roleName: RoleEnum;
  fullName: string;
  email: string;
  mssv?: string;
  class?: string;
  phoneNumber?: string;
}

const testAccounts: AccountSeed[] = [
  { username: "admin", password: "admin123", roleName: RoleEnum.ADMIN, fullName: "Nguyễn Minh Quân", email: "admin@test.local", class: "Phòng Công tác Sinh viên", phoneNumber: "0909000001" },
  { username: "leader", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Trần Gia Huy", email: "leader@test.local", mssv: "21520001", class: "Khoa Khoa học Máy tính - KHMT2021", phoneNumber: "0909001001" },
  { username: "leader2", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Lê Ngọc Anh", email: "leader2@test.local", mssv: "21520002", class: "Khoa Hệ thống Thông tin - HTTT2021", phoneNumber: "0909001002" },
  { username: "leader_mtc", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Phạm Minh Khang", email: "leader.mtc@test.local", mssv: "21520003", class: "Khoa Kỹ thuật Máy tính - KTMT2021", phoneNumber: "0909001003" },
  { username: "leader_sx", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Võ Thanh Trúc", email: "leader.sx@test.local", mssv: "21520004", class: "Khoa Mạng máy tính và Truyền thông - MMT2021", phoneNumber: "0909001004" },
  { username: "leader_ngm", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Đặng Hoàng Nam", email: "leader.ngm@test.local", mssv: "21520005", class: "Khoa Khoa học và Kỹ thuật Thông tin - KHKT2021", phoneNumber: "0909001005" },
  { username: "leader_vn", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Nguyễn Khánh Vy", email: "leader.vn@test.local", mssv: "21520006", class: "Khoa Công nghệ Phần mềm - CNPM2021", phoneNumber: "0909001006" },
  { username: "leader_xcn", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Huỳnh Nhật Minh", email: "leader.xcn@test.local", mssv: "22520007", class: "Khoa Khoa học Máy tính - KHMT2022", phoneNumber: "0909001007" },
  { username: "leader_vx", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Bùi Thảo Nhi", email: "leader.vx@test.local", mssv: "22520008", class: "Khoa Hệ thống Thông tin - HTTT2022", phoneNumber: "0909001008" },
  { username: "leader_nx", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Đỗ Quốc Bảo", email: "leader.nx@test.local", mssv: "22520009", class: "Khoa Kỹ thuật Máy tính - KTMT2022", phoneNumber: "0909001009" },
  { username: "leader_tt", password: "leader123", roleName: RoleEnum.LEADER, fullName: "Mai Phương Linh", email: "leader.tt@test.local", mssv: "22520010", class: "Khoa Mạng máy tính và Truyền thông - MMT2022", phoneNumber: "0909001010" },
];

export const seedAccounts = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const accountRepo = dataSource.getRepository(Account);
  const userRepo = dataSource.getRepository(User);

  for (const testAccount of testAccounts) {
    const role = await roleRepo.findOneBy({ roleName: testAccount.roleName });
    if (!role) throw new Error(`Missing role: ${testAccount.roleName}`);

    const password = await bcrypt.hash(testAccount.password, 10);
    const now = new Date().toISOString();
    let account = await accountRepo.findOne({ where: { username: testAccount.username } });

    if (account) {
      account.password = password;
      account.roleId = role.roleId;
      account.updatedAt = now;
      account.isDeleted = false;
    } else {
      account = accountRepo.create({ username: testAccount.username, password, roleId: role.roleId, createdAt: now, isDeleted: false });
    }

    const savedAccount = await accountRepo.save(account);
    let user = await userRepo.findOne({ where: { account: { accId: savedAccount.accId } }, relations: { account: true } });

    if (user) {
      user.fullName = testAccount.fullName;
      user.email = testAccount.email;
      user.mssv = testAccount.mssv ?? null;
      user.class = testAccount.class ?? null;
      user.phoneNumber = testAccount.phoneNumber ?? null;
      user.isDeleted = 0;
      user.account = savedAccount;
    } else {
      user = userRepo.create({ fullName: testAccount.fullName, email: testAccount.email, mssv: testAccount.mssv, class: testAccount.class, phoneNumber: testAccount.phoneNumber, isDeleted: 0, account: savedAccount });
    }
    await userRepo.save(user);
  }

  console.log("Accounts seeded: admin/admin123, leader*/leader123");
};
