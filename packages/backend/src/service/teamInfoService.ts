import { AppDataSource } from "../db/data-source.js";
import { Team } from "../entities/Team.js";
import { User } from "../entities/User.js";
import { UpdateTeamInput } from "../schemas/teamInfo.js";
import { RoleEnum } from "@uit-volunteer-map/shared";

export class TeamService {
  private teamRepo = AppDataSource.getRepository(Team);
  private userRepo = AppDataSource.getRepository(User);

  /**
   * Update team information.
   * @param teamId - The ID of the team to update
   * @param data - The data to update
   * @param currentUser - The user from Token (NOT just the User Entity)
   */
  // FIX: Change type to 'any' to access .role and .userId freely
  async updateTeam(teamId: number, data: UpdateTeamInput, currentUser: any) {
    
    // 1. Find the target team
    const team = await this.teamRepo.findOne({
      where: { teamId: teamId }
    });

    if (!team) {
      throw new Error("TEAM_NOT_FOUND");
    }

    // 2. Permission Check: LEADER
    // currentUser from Token usually has 'role' property
    if (currentUser.role === RoleEnum.LEADER) {
      
      // We need to check which team this Leader belongs to.
      // Since User Entity doesn't store teamId directly, we fetch it via relation.
      // Using 'currentUser.userId' (assuming token has userId field)
      const leaderEntity = await this.userRepo.findOne({
        where: { userId: currentUser.userId },
        relations: { team: true } 
      });

      // Check if leaderEntity exists, has a team, and matches the target teamId
      if (!leaderEntity || !leaderEntity.team || leaderEntity.team.teamId !== teamId) {
        throw new Error("FORBIDDEN_ACCESS");
      }
    }

    // 3. Permission Check: ADMIN (Allowed by default)

    // 4. Update Data
    if (data.teamName) {
      team.teamName = data.teamName;
    }
    if (data.description !== undefined) {
      team.description = data.description;
    }

    // 5. Save
    return await this.teamRepo.save(team);
  }
}