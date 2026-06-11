import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { RoleEnum } from "@uit-volunteer-map/shared";
import { Account } from "../../entities/Account.js";
import { Role } from "../../entities/Role.js";
import { User } from "../../entities/User.js";

const testAccounts = [
  {
    username: "admin",
    password: "admin123",
    roleName: RoleEnum.ADMIN,
    fullName: "Test Admin",
    email: "admin@test.local",
  },
  {
    username: "leader",
    password: "leader123",
    roleName: RoleEnum.LEADER,
    fullName: "Test Leader",
    email: "leader@test.local",
  },
  {
    username: "leader2",
    password: "leader123",
    roleName: RoleEnum.LEADER,
    fullName: "Test Leader 2",
    email: "leader2@test.local",
  },
];

export const seedAccounts = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const accountRepo = dataSource.getRepository(Account);
  const userRepo = dataSource.getRepository(User);

  for (const testAccount of testAccounts) {
    const role = await roleRepo.findOneBy({ roleName: testAccount.roleName });

    if (!role) {
      throw new Error(`Missing role: ${testAccount.roleName}`);
    }

    const password = await bcrypt.hash(testAccount.password, 10);
    const now = new Date().toISOString();
    let account = await accountRepo.findOne({
      where: { username: testAccount.username },
    });

    if (account) {
      account.password = password;
      account.roleId = role.roleId;
      account.updatedAt = now;
      account.isDeleted = false;
    } else {
      account = accountRepo.create({
        username: testAccount.username,
        password,
        roleId: role.roleId,
        createdAt: now,
        isDeleted: false,
      });
    }

    const savedAccount = await accountRepo.save(account);
    const existingUser = await userRepo.findOne({
      where: { account: { accId: savedAccount.accId } },
      relations: { account: true },
    });

    if (!existingUser) {
      await userRepo.save(
        userRepo.create({
          fullName: testAccount.fullName,
          email: testAccount.email,
          isDeleted: 0,
          account: savedAccount,
        }),
      );
    }
  }

  console.log("Accounts seeded: admin/admin123, leader/leader123, leader2/leader123");
};
