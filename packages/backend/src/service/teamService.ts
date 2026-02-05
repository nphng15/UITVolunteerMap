import { AppDataSource } from "../db/data-source.js";
import { Team } from "../entities/Team.js";
import { User } from "../entities/User.js";
import { Campaign } from "../entities/Campaign.js";
import { CreateTeamInput, UpdateTeamInput } from "../schemas/team.js";
import { HttpError } from "../errors/HttpError.js";
import { HTTP_STATUS, TEAM_ERRORS, RoleEnum, type JwtPayload } from "@uit-volunteer-map/shared";

export class TeamService {
  private teamRepo = AppDataSource.getRepository(Team);
  private userRepo = AppDataSource.getRepository(User);
  private campaignRepo = AppDataSource.getRepository(Campaign);
  async getAll(userRole?: string) {
    const teams = await this.teamRepo.find({
      where: { isDeleted: 0 },
      relations: ["leader", "users", "users.account", "users.account.role"],
    });
   if (userRole === "guest" || !userRole) {
      return teams.map((team) => {
        const leaders = team.users.filter(
          (u) =>
            u.isDeleted === 0 && u.account?.role?.roleName === RoleEnum.LEADER,
        );

        return {
          teamId: team.teamId,
          teamName: team.teamName,
          imageUrl: team.imageUrl,
          leaders: leaders.map((l) => ({
            userId: l.userId,
            fullName: l.fullName,
            role: l.account?.role?.roleName,
          })),
        };
      });
    }

    return teams.map((team) => {
      const leaders = team.users.filter(
        (u) =>
          u.isDeleted === 0 && u.account?.role?.roleName === RoleEnum.LEADER,
      );

      const leaderIds = leaders.map((l) => l.userId);
      const members = team.users.filter(
        (u) => u.isDeleted === 0 && !leaderIds.includes(u.userId),
      );

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        description: team.description,
        imageUrl: team.imageUrl,
        leaders: leaders.map((l) => ({
          userId: l.userId,
          fullName: l.fullName,
          role: l.account?.role?.roleName,
        })),
        members: members.map((m) => ({
          userId: m.userId,
          fullName: m.fullName,
        })),
      };
    });
  }

  private async getTeamEntity(id: number) {
    const team = await this.teamRepo.findOne({
      where: { teamId: id, isDeleted: 0 },
      relations: ["leader", "users", "users.account", "users.account.role"],
    });

    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return team;
  }

  async getOne(id: number) {
    const team = await this.getTeamEntity(id);

    const leaders = await this.userRepo.find({
      where: {
        team: { teamId: id },
        isDeleted: 0,
        account: {
          role: {
            roleName: RoleEnum.LEADER,
          },
        },
      },
      relations: ["account", "account.role"],
    });

    return {
      teamId: team.teamId,
      teamName: team.teamName,
      description: team.description,
      imageUrl: team.imageUrl,
      leaders: leaders.map((leader) => ({
        userId: leader.userId,
        fullName: leader.fullName,
        role: leader.account?.role?.roleName,
        avatarUrl: leader.avatarUrl,
      })),
    };
  }
  
  async create(data: CreateTeamInput) {
    const campaign = await this.campaignRepo.findOne({
      where: { campaignId: data.campaignId },
    });
    if (!campaign) {
      throw new HttpError(
        TEAM_ERRORS.CAMPAIGN_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const existing = await this.teamRepo.findOne({
      where: {
        teamName: data.teamName,
        campaign: { campaignId: data.campaignId },
      },
    });

    if (existing) {
      throw new HttpError(TEAM_ERRORS.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const leader = await this.userRepo.findOne({
      where: { userId: data.leaderId, isDeleted: 0 },
      relations: ["account", "account.role"],
    });

    if (!leader) {
      throw new HttpError(TEAM_ERRORS.LEADER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (leader.account?.role?.roleName !== RoleEnum.LEADER) {
      throw new HttpError(
        TEAM_ERRORS.LEADER_INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const newTeam = this.teamRepo.create({
      teamName: data.teamName,
      description: data.description,
      leader: { userId: data.leaderId } as any,
      imageUrl: data.imageUrl,
      campaign: { campaignId: data.campaignId } as any,
      isDeleted: 0,
    });

    return await this.teamRepo.save(newTeam);
  }

  async delete(id: number) {
    const team = await this.getTeamEntity(id);

    team.isDeleted = 1;
    await this.teamRepo.save(team);
    const users = await this.userRepo.find({
      where: { team: { teamId: id }, isDeleted: 0 },
    });
    for (const user of users) {
      user.isDeleted = 1;
      await this.userRepo.save(user);
    }

    return true;
  }

  async update(id: number, data: UpdateTeamInput, currentUser: JwtPayload) {
    const team = await this.getTeamEntity(id);

    if (currentUser.role === RoleEnum.LEADER) {
      const leaderUser = await this.userRepo.findOne({
        where: { account: { accId: currentUser.accId }, isDeleted: 0 },
        relations: ["team"],
      });

      if (!leaderUser || !leaderUser.team || leaderUser.team.teamId !== id) {
        throw new HttpError(TEAM_ERRORS.FORBIDDEN_ACCESS, HTTP_STATUS.FORBIDDEN);
      }
    }

    if (data.teamName) {
      team.teamName = data.teamName;
    }
    if (data.description !== undefined) {
      team.description = data.description;
    }
    if (data.imageUrl !== undefined) {
      team.imageUrl = data.imageUrl;
    }

    return await this.teamRepo.save(team);
  }
}

