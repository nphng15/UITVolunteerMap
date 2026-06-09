import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { RoleEnum } from "@uit-volunteer-map/shared";
import { Account } from "../../entities/Account.js";
import { Role } from "../../entities/Role.js";
import { User } from "../../entities/User.js";
import { Team } from "../../entities/Team.js";

// TNV test, gán vào đội thuộc "Mùa Hè Xanh 2026" để thử luồng điểm danh kèm ảnh.
const testVolunteer = {
  username: "volunteer",
  password: "volunteer123",
  fullName: "Nguyễn Tình Nguyện",
  email: "volunteer@test.local",
  teamName: "Đội Mùa Hè Xanh - UIT 1",
};

export const seedVolunteers = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const accountRepo = dataSource.getRepository(Account);
  const userRepo = dataSource.getRepository(User);
  const teamRepo = dataSource.getRepository(Team);

  const role = await roleRepo.findOneBy({ roleName: RoleEnum.VOLUNTEER });
  if (!role) {
    throw new Error(`Missing role: ${RoleEnum.VOLUNTEER}`);
  }

  const team = await teamRepo.findOne({
    where: { teamName: testVolunteer.teamName },
  });
  if (!team) {
    throw new Error(`Missing team: ${testVolunteer.teamName}`);
  }

  const password = await bcrypt.hash(testVolunteer.password, 10);
  const now = new Date().toISOString();

  let account = await accountRepo.findOne({
    where: { username: testVolunteer.username },
  });
  if (account) {
    account.password = password;
    account.roleId = role.roleId;
    account.updatedAt = now;
    account.isDeleted = false;
  } else {
    account = accountRepo.create({
      username: testVolunteer.username,
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
    user.fullName = testVolunteer.fullName;
    user.email = testVolunteer.email;
    user.isDeleted = 0;
    user.team = team;
  } else {
    user = userRepo.create({
      fullName: testVolunteer.fullName,
      email: testVolunteer.email,
      isDeleted: 0,
      account: savedAccount,
      team,
    });
  }
  await userRepo.save(user);

  console.log("Volunteer seeded: volunteer/volunteer123 (team: Đội Mùa Hè Xanh - UIT 1)");
};
