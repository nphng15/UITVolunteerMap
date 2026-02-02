import { AppDataSource } from "../db/data-source.js";
import { Team } from "../entities/Team.js";
import { User } from "../entities/User.js";
import { Photo } from "../entities/Photo.js";
import { Campaign } from "../entities/Campaign.js";
import { CreateTeamInput, UpdateTeamInput } from "../schemas/team.js";
import { HttpError } from "../errors/HttpError.js";
import { HTTP_STATUS, TEAM_ERRORS, RoleEnum } from "@uit-volunteer-map/shared";

export class TeamService {
  private teamRepo = AppDataSource.getRepository(Team);
  private userRepo = AppDataSource.getRepository(User);
  private photoRepo = AppDataSource.getRepository(Photo);
  private campaignRepo = AppDataSource.getRepository(Campaign);

  // 1. GET ALL TEAMS (with different views for different roles)
  async getAll(userRole?: string) {
    const teams = await this.teamRepo.find({
      where: { isDeleted: 0 },
      relations: ["leader", "users", "photos"],
    });

    // Guest: only see team name and leader
    if (userRole === "guest" || !userRole) {
      return teams.map((team) => ({
        teamId: team.teamId,
        teamName: team.teamName,
        leader: team.leader
          ? {
              userId: team.leader.userId,
              fullName: team.leader.fullName,
              email: team.leader.email,
            }
          : null,
      }));
    }

    // Admin/Leader: see full details (without sensitive account data)
    return teams.map((team) => {
      const teamData = { ...team };
      if (teamData.leader) {
        delete (teamData.leader as any).account;
      }
      if (teamData.users) {
        teamData.users.forEach((user) => delete (user as any).account);
      }
      return teamData;
    });
  }

  // Internal method to get full Team entity
  private async getTeamEntity(id: number) {
    const team = await this.teamRepo.findOne({
      where: { teamId: id, isDeleted: 0 },
      relations: ["leader", "users", "photos"],
    });

    if (!team) {
      throw new HttpError(TEAM_ERRORS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return team;
  }

  // 2. GET ONE TEAM (detailed view - public safe data)
  async getOne(id: number) {
    const team = await this.getTeamEntity(id);

    // Return safe data (for public access)
    return {
      teamId: team.teamId,
      teamName: team.teamName,
      description: team.description,
      imageUrl: team.imageUrl,
      leader: team.leader
        ? {
            userId: team.leader.userId,
            fullName: team.leader.fullName,
            email: team.leader.email,
          }
        : null,
      members: team.users.map((user) => ({
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      })),
      photos: team.photos.map((photo) => ({
        photoId: photo.photoId,
        title: photo.title,
        imageUrl: photo.imageUrl,
        uploadedAt: photo.uploadedAt,
      })),
    };
  }

  // 3. CREATE TEAM (Admin only)
  async create(data: CreateTeamInput) {
    // Check if team name already exists
    const existing = await this.teamRepo.findOne({
      where: { teamName: data.teamName },
    });
    if (existing) {
      throw new HttpError(TEAM_ERRORS.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    // Verify campaign exists
    const campaign = await this.campaignRepo.findOne({
      where: { campaignId: data.campaignId },
    });
    if (!campaign) {
      throw new HttpError(TEAM_ERRORS.CAMPAIGN_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }

    // Verify leader exists and has LEADER role
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

    // Create team
    const newTeam = this.teamRepo.create({
      teamName: data.teamName,
      description: data.description,
      leaderId: data.leaderId,
      imageUrl: data.imageUrl,
      campaign: { campaignId: data.campaignId } as any,
      isDeleted: 0,
    });

    return await this.teamRepo.save(newTeam);
  }

  // 4. UPDATE TEAM (Admin only)
  async update(id: number, data: UpdateTeamInput) {
    const team = await this.getTeamEntity(id);

    // If updating leader, verify the new leader
    if (data.leaderId) {
      const leader = await this.userRepo.findOne({
        where: { userId: data.leaderId, isDeleted: 0 },
        relations: ["account", "account.role"],
      });

      if (!leader) {
        throw new HttpError(
          TEAM_ERRORS.LEADER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      if (leader.account?.role?.roleName !== RoleEnum.LEADER) {
        throw new HttpError(
          TEAM_ERRORS.LEADER_INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Check team name uniqueness if updating name
    if (data.teamName && data.teamName !== team.teamName) {
      const existing = await this.teamRepo.findOne({
        where: { teamName: data.teamName, isDeleted: 0 },
      });
      if (existing) {
        throw new HttpError(TEAM_ERRORS.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
      }
    }

    this.teamRepo.merge(team, data);
    return await this.teamRepo.save(team);
  }

  // 5. DELETE TEAM (Soft delete - Admin only)
  async delete(id: number) {
    const team = await this.getTeamEntity(id);

    // Soft delete team
    team.isDeleted = 1;
    await this.teamRepo.save(team);

    // Soft delete related users
    const users = await this.userRepo.find({
      where: { team: { teamId: id }, isDeleted: 0 },
    });
    for (const user of users) {
      user.isDeleted = 1;
      await this.userRepo.save(user);
    }

    // Soft delete related photos
    const photos = await this.photoRepo.find({
      where: { team: { teamId: id }, isDeleted: 0 },
    });
    for (const photo of photos) {
      photo.isDeleted = 1;
      await this.photoRepo.save(photo);
    }

    return true;
  }
}
