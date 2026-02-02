import { Router, Response } from 'express';
import { TeamService } from '../service/teamInfoService.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateTeamSchema } from '../schemas/teamInfo.js';
import { RoleEnum } from '@uit-volunteer-map/shared';

const router = Router();
const teamService = new TeamService();

// Apply authentication middleware globally for team routes
router.use(authenticateToken);

/**
 * PUT /api/teams/:id
 * Description: Update team details (Name, Description)
 * Access: ADMIN, LEADER
 */
router.put(
  '/:id', 
  requireRole([RoleEnum.ADMIN, RoleEnum.LEADER]), // Only allow Admin and Leader
  validate(updateTeamSchema), // Validate request body
  async (req: any, res: Response) => {
    try {
      const teamId = Number(req.params.id);
      
      // Pass the currentUser (req.user) to the service for permission checking
      const updatedTeam = await teamService.updateTeam(teamId, req.body, req.user);
      
      res.json({ success: true, data: updatedTeam });
    } catch (e: any) {
      // Handle specific business logic errors
      if (e.message === "TEAM_NOT_FOUND") {
          return res.status(404).json({ success: false, message: "Team not found" });
      }
      if (e.message === "FORBIDDEN_ACCESS") {
          return res.status(403).json({ success: false, message: "You are not allowed to update this team" });
      }
      
      // Handle server errors
      console.error("Update Team Error:", e);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

export { router as teamRouter };