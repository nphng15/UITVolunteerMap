import { DataSource } from "typeorm";
import { RoleEnum } from "@uit-volunteer-map/shared";
import { Campaign } from "../../entities/Campaign.js";
import { Team } from "../../entities/Team.js";
import { User } from "../../entities/User.js";

const testTeams = [
  {
    teamName: "Đội Mùa Hè Xanh - UIT 1",
    description: "Đội tình nguyện chính của khoa CNPM phụ trách Linh Trung.",
    imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/teams/team1.jpg",
    leaderUsername: "leader",
    campaignName: "Mùa Hè Xanh 2026",
  },
  {
    teamName: "Đội Mùa Hè Xanh - UIT 2",
    description: "Đội phụ trách điểm Củ Chi và các tuyến vùng ven.",
    imageUrl: "https://res.cloudinary.com/uitvolunteermap/image/upload/v1/teams/team2.jpg",
    leaderUsername: "leader2",
    campaignName: "Mùa Hè Xanh 2026",
  },
];

export const seedTeams = async (dataSource: DataSource) => {
  const teamRepo = dataSource.getRepository(Team);
  const campaignRepo = dataSource.getRepository(Campaign);
  const userRepo = dataSource.getRepository(User);

  for (const data of testTeams) {
    const campaign = await campaignRepo.findOne({
      where: { campaignName: data.campaignName },
    });
    if (!campaign) throw new Error(`Missing campaign: ${data.campaignName}`);

    const leaderUser = await userRepo.findOne({
      where: { account: { username: data.leaderUsername } },
      relations: { account: { role: true } },
    });
    if (!leaderUser) throw new Error(`Missing leader user: ${data.leaderUsername}`);
    if (leaderUser.account?.role?.roleName !== RoleEnum.LEADER) {
      throw new Error(`User ${data.leaderUsername} is not a LEADER`);
    }

    let team = await teamRepo.findOne({
      where: { teamName: data.teamName },
      relations: { leader: true, campaign: true },
    });

    if (team) {
      team.description = data.description;
      team.imageUrl = data.imageUrl;
      team.isDeleted = 0;
      team.leader = leaderUser;
      team.campaign = campaign;
    } else {
      team = teamRepo.create({
        teamName: data.teamName,
        description: data.description,
        imageUrl: data.imageUrl,
        isDeleted: 0,
        leader: leaderUser,
        campaign,
      });
    }
    const saved = await teamRepo.save(team);

    if (!leaderUser.team || leaderUser.team.teamId !== saved.teamId) {
      leaderUser.team = saved;
      await userRepo.save(leaderUser);
    }
  }

  console.log("Teams seeded: Đội Mùa Hè Xanh - UIT 1, Đội Mùa Hè Xanh - UIT 2");
};
