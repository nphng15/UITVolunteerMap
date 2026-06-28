import { AppDataSource } from "../db/data-source.js";
import { Team } from "../entities/Team.js";
import { User } from "../entities/User.js";
import { Campaign } from "../entities/Campaign.js";
import { Attachment } from "../entities/Attachment.js";
import { CreateTeamInput, UpdateTeamInput, type AttachmentInput, type UpdateTeamCheckInLocationInput } from "../schemas/team.js";
import { HttpError } from "../errors/HttpError.js";
import { HTTP_STATUS, TEAM_ERRORS, RoleEnum, type JwtPayload } from "@uit-volunteer-map/shared";

export class TeamService {
  private teamRepo = AppDataSource.getRepository(Team);
  private userRepo = AppDataSource.getRepository(User);
  private campaignRepo = AppDataSource.getRepository(Campaign);
  private attachmentRepo = AppDataSource.getRepository(Attachment);
  async getAll(userRole?: string, campaignId?: number) {
    const teams = await this.teamRepo.find({
      where: {
        isDeleted: 0,
        ...(campaignId ? { campaign: { campaignId } } : {}),
      },
      relations: [
        "campaign",
        "leader",
        "leader.account",
        "leader.account.role",
        "users",
        "users.account",
        "users.account.role",
      ],
      order: { teamId: "ASC" },
    });

    if (userRole === "guest" || !userRole) {
      return teams.map((team) => {
        const leaders = this.getTeamLeaders(team);

        return {
          teamId: team.teamId,
          teamName: team.teamName,
          imageUrl: team.imageUrl,
          campaignId: team.campaign?.campaignId ?? null,
          campaignName: team.campaign?.campaignName ?? null,
          leaders: leaders.map((leader) => ({
            userId: leader.userId,
            fullName: leader.fullName,
            role: leader.account?.role?.roleName,
            avatarUrl: leader.avatarUrl ?? null,
          })),
        };
      });
    }

    return teams.map((team) => {
      const leaders = this.getTeamLeaders(team);
      const leaderIds = leaders.map((leader) => leader.userId);
      const members = team.users.filter(
        (user) => user.isDeleted === 0 && !leaderIds.includes(user.userId),
      );

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        description: team.description,
        imageUrl: team.imageUrl,
        campaignId: team.campaign?.campaignId ?? null,
        campaignName: team.campaign?.campaignName ?? null,
        leaders: leaders.map((leader) => ({
          userId: leader.userId,
          fullName: leader.fullName,
          role: leader.account?.role?.roleName,
          avatarUrl: leader.avatarUrl ?? null,
        })),
        members: members.map((member) => ({
          userId: member.userId,
          fullName: member.fullName,
        })),
      };
    });
  }

  private getTeamLeaders(team: Team) {
    const userLeaders = team.users.filter(
      (user) =>
        user.isDeleted === 0 && user.account?.role?.roleName === RoleEnum.LEADER,
    );

    if (userLeaders.length > 0) {
      return userLeaders;
    }

    return team.leader ? [team.leader] : [];
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

    const savedTeam = await this.teamRepo.save(newTeam);

    if (data.attachments && data.attachments.length > 0) {
      const attachmentsToCreate = data.attachments.map((attachment, index) =>
        this.attachmentRepo.create({
          imageUrl: attachment.imageUrl,
          uploadedAt: new Date().toISOString(),
          position: attachment.position ?? index,
          team: { teamId: savedTeam.teamId } as any,
        })
      );
      await this.attachmentRepo.save(attachmentsToCreate);
    }

    return await this.teamRepo.findOne({
      where: { teamId: savedTeam.teamId },
      relations: ["attachments", "leader"],
    });
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

  async updateCheckInLocation(
    id: number,
    data: UpdateTeamCheckInLocationInput,
    currentUser: JwtPayload,
  ) {
    const team = await this.teamRepo.findOne({
      where: { teamId: id, isDeleted: 0 },
      relations: ["leader", "leader.account"],
    });

    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (currentUser.role === RoleEnum.LEADER) {
      const leaderUser = await this.userRepo.findOne({
        where: { account: { accId: currentUser.accId }, isDeleted: 0 },
      });

      if (!leaderUser || team.leader?.userId !== leaderUser.userId) {
        throw new HttpError(TEAM_ERRORS.FORBIDDEN_ACCESS, HTTP_STATUS.FORBIDDEN);
      }
    }

    team.checkInLatitude = data.latitude;
    team.checkInLongitude = data.longitude;
    team.checkInRadius = data.radius;

    const saved = await this.teamRepo.save(team);
    return {
      teamId: saved.teamId,
      teamName: saved.teamName,
      checkInLatitude: saved.checkInLatitude,
      checkInLongitude: saved.checkInLongitude,
      checkInRadius: saved.checkInRadius,
    };
  }

  async addAttachments(teamId: number, attachments: AttachmentInput[], currentUser: JwtPayload) {
    await this.getTeamEntity(teamId);

    if (currentUser.role === RoleEnum.LEADER) {
      const leaderUser = await this.userRepo.findOne({
        where: { account: { accId: currentUser.accId }, isDeleted: 0 },
        relations: ["team"],
      });

      if (!leaderUser || !leaderUser.team || leaderUser.team.teamId !== teamId) {
        throw new HttpError(TEAM_ERRORS.FORBIDDEN_ACCESS, HTTP_STATUS.FORBIDDEN);
      }
    }

    const existingAttachments = await this.attachmentRepo.find({
      where: { team: { teamId } },
      order: { position: "DESC" },
    });
    const maxPosition = existingAttachments.length > 0 
      ? (existingAttachments[0].position ?? 0) 
      : -1;

    const attachmentsToCreate = attachments.map((attachment, index) =>
      this.attachmentRepo.create({
        imageUrl: attachment.imageUrl,
        uploadedAt: new Date().toISOString(),
        position: attachment.position ?? (maxPosition + 1 + index),
        team: { teamId } as any,
      })
    );

    const savedAttachments = await this.attachmentRepo.save(attachmentsToCreate);
    return savedAttachments;
  }

  async getMembers(teamId: number) {
    const team = await this.teamRepo.findOne({
      where: { teamId, isDeleted: 0 },
    });
    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const users = await this.userRepo.find({
      where: { team: { teamId }, isDeleted: 0 },
      relations: ["account", "account.role", "team"],
      order: { fullName: "ASC" },
    });

    return users.map((user) => ({
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      mssv: user.mssv,
      class: user.class,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl ?? null,
      role: user.account?.role?.roleName ?? null,
      teamId,
    }));
  }

  async assignMember(teamId: number, userId: number) {
    const team = await this.teamRepo.findOne({
      where: { teamId, isDeleted: 0 },
    });
    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const user = await this.userRepo.findOne({
      where: { userId, isDeleted: 0 },
      relations: ["account", "account.role", "team"],
    });
    if (!user) {
      throw new HttpError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    user.team = team;
    const saved = await this.userRepo.save(user);

    return {
      userId: saved.userId,
      fullName: saved.fullName,
      role: saved.account?.role?.roleName ?? null,
      teamId,
    };
  }

  async removeMember(teamId: number, userId: number) {
    const user = await this.userRepo.findOne({
      where: { userId, team: { teamId }, isDeleted: 0 },
      relations: ["team"],
    });
    if (!user) {
      throw new HttpError("Team member not found", HTTP_STATUS.NOT_FOUND);
    }

    user.team = null as any;
    await this.userRepo.save(user);
  }

  async getTeamWithAttachments(teamId: number) {
    const team = await this.teamRepo.findOne({
      where: { teamId, isDeleted: 0 },
      relations: ["attachments", "leader"],
    });

    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return team;
  }
}
