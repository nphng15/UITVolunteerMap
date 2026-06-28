import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import app from '../app.js';
import { AppDataSource } from '../db/data-source.js';
import { Account } from '../entities/Account.js';
import { Role } from '../entities/Role.js';
import { User } from '../entities/User.js';
import { Campaign } from '../entities/Campaign.js';
import { Team } from '../entities/Team.js';
import { Post } from '../entities/Post.js';
import { Photo } from '../entities/Photo.js';
import { Attachment } from '../entities/Attachment.js';
import { CheckIn } from '../entities/CheckIn.js';
import { CampaignPhoto } from '../entities/CampaignPhoto.js';
import { RoleEnum, HTTP_STATUS, CHECKIN_ERRORS, CHECKIN_MESSAGES } from '@uit-volunteer-map/shared';

const JWT_SECRET = process.env.JWT_SECRET!;
const TEAM_NOT_ASSIGNED_ERROR = 'Volunteer is not assigned to a team in this campaign';
const TEAM_NO_LOCATION_ERROR = 'Team check-in location is not configured';

// UIT campus coordinates for testing
const UIT_LAT = 10.8700;
const UIT_LNG = 106.8030;

describe('Check-in Routes', () => {
  let volunteerToken: string;
  let otherVolunteerToken: string;
  let adminToken: string;
  let volunteerUserId: number;
  let otherVolunteerUserId: number;
  let leaderUserId: number;
  let activeCampaignId: number;
  let activeTeamId: number;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.setOptions({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [Account, Role, User, Campaign, Team, Post, Photo, Attachment, CheckIn, CampaignPhoto],
        migrations: [],
        subscribers: [],
      }).initialize();
    } else {
      await AppDataSource.synchronize(true);
    }

    const roleRepo = AppDataSource.getRepository(Role);
    const accRepo = AppDataSource.getRepository(Account);
    const userRepo = AppDataSource.getRepository(User);

    const adminRole = await roleRepo.save({ roleName: RoleEnum.ADMIN });
    const leaderRole = await roleRepo.save({ roleName: RoleEnum.LEADER });
    const volunteerRole = await roleRepo.save({ roleName: RoleEnum.VOLUNTEER });

    const adminPass = await bcrypt.hash('admin123', 10);
    const volunteerPass = await bcrypt.hash('volunteer123', 10);

    const adminAccount = await accRepo.save({
      username: 'admin',
      password: adminPass,
      roleId: adminRole.roleId,
    });

    const leaderAccount = await accRepo.save({
      username: 'leader1',
      password: await bcrypt.hash('leader123', 10),
      roleId: leaderRole.roleId,
    });

    const leaderUser = await userRepo.save({
      fullName: 'Leader One',
      email: 'leader1@gm.uit.edu.vn',
      account: leaderAccount,
    });
    leaderUserId = leaderUser.userId;

    const volunteerAccount = await accRepo.save({
      username: 'volunteer1',
      password: volunteerPass,
      roleId: volunteerRole.roleId,
    });

    const volunteerUser = await userRepo.save({
      fullName: 'Volunteer One',
      email: 'volunteer1@gm.uit.edu.vn',
      account: volunteerAccount,
    });
    volunteerUserId = volunteerUser.userId;

    const otherVolunteerAccount = await accRepo.save({
      username: 'volunteer2',
      password: await bcrypt.hash('volunteer456', 10),
      roleId: volunteerRole.roleId,
    });

    const otherVolunteerUser = await userRepo.save({
      fullName: 'Volunteer Two',
      email: 'volunteer2@gm.uit.edu.vn',
      account: otherVolunteerAccount,
    });
    otherVolunteerUserId = otherVolunteerUser.userId;

    adminToken = jwt.sign(
      { accId: adminAccount.accId, role: RoleEnum.ADMIN },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    volunteerToken = jwt.sign(
      { accId: volunteerAccount.accId, role: RoleEnum.VOLUNTEER },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    otherVolunteerToken = jwt.sign(
      { accId: otherVolunteerAccount.accId, role: RoleEnum.VOLUNTEER },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    const checkInRepo = AppDataSource.getRepository(CheckIn);
    const campaignRepo = AppDataSource.getRepository(Campaign);
    const campaignPhotoRepo = AppDataSource.getRepository(CampaignPhoto);
    const teamRepo = AppDataSource.getRepository(Team);
    const userRepo = AppDataSource.getRepository(User);
    await campaignPhotoRepo.clear();
    await checkInRepo.clear();
    await userRepo.createQueryBuilder().update(User).set({ team: null as any }).execute();
    await teamRepo.clear();
    await campaignRepo.clear();

    const campaign = await campaignRepo.save({
      campaignName: 'Active Campaign',
      startDate: '2020-01-01',
      endDate: '2030-12-31',
      latitude: UIT_LAT,
      longitude: UIT_LNG,
      checkInRadius: 100,
    });
    activeCampaignId = campaign.campaignId;

    const team = await teamRepo.save({
      teamName: 'Team A',
      campaign,
      leader: { userId: leaderUserId } as any,
      checkInLatitude: UIT_LAT,
      checkInLongitude: UIT_LNG,
      checkInRadius: 100,
      isDeleted: 0,
    } as any);
    activeTeamId = team.teamId;

    const volunteer = await userRepo.findOneByOrFail({ userId: volunteerUserId });
    volunteer.team = team;
    await userRepo.save(volunteer);

    const otherVolunteer = await userRepo.findOneByOrFail({ userId: otherVolunteerUserId });
    otherVolunteer.team = team;
    await userRepo.save(otherVolunteer);
  });

  describe('POST /api/checkin', () => {
    it('should check in successfully using team location when campaign has no location', async () => {
      const campaignRepo = AppDataSource.getRepository(Campaign);
      const teamRepo = AppDataSource.getRepository(Team);
      const userRepo = AppDataSource.getRepository(User);
      const noLocationCampaign = await campaignRepo.save({
        campaignName: 'Team Location Campaign',
        startDate: '2020-01-01',
        endDate: '2030-12-31',
      });
      const team = await teamRepo.save({
        teamName: 'Team Location Team',
        campaign: noLocationCampaign,
        leader: { userId: leaderUserId } as any,
        checkInLatitude: UIT_LAT,
        checkInLongitude: UIT_LNG,
        checkInRadius: 100,
        isDeleted: 0,
      } as any);
      const volunteer = await userRepo.findOneByOrFail({ userId: volunteerUserId });
      volunteer.team = team;
      await userRepo.save(volunteer);

      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: noLocationCampaign.campaignId,
          latitude: UIT_LAT + 0.0001,
          longitude: UIT_LNG + 0.0001,
        });

      expect(res.status).toBe(HTTP_STATUS.CREATED);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(CHECKIN_MESSAGES.SUCCESS);
      expect(res.body.data.checkInId).toBeDefined();
      expect(res.body.data.distance).toBeLessThan(100);
    });

    it('should return 404 when campaign does not exist', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: 9999,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(CHECKIN_ERRORS.CAMPAIGN_NOT_FOUND);
    });

    it('should return 404 when volunteer is not assigned to a team in campaign', async () => {
      const userRepo = AppDataSource.getRepository(User);
      const volunteer = await userRepo.findOneByOrFail({ userId: volunteerUserId });
      volunteer.team = null as any;
      await userRepo.save(volunteer);

      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({ campaignId: activeCampaignId, latitude: UIT_LAT, longitude: UIT_LNG });

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(TEAM_NOT_ASSIGNED_ERROR);
    });

    it('should return 400 when team has no configured check-in location', async () => {
      const teamRepo = AppDataSource.getRepository(Team);
      const team = await teamRepo.findOneByOrFail({ teamId: activeTeamId });
      (team as any).checkInLatitude = null;
      (team as any).checkInLongitude = null;
      await teamRepo.save(team);

      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({ campaignId: activeCampaignId, latitude: UIT_LAT, longitude: UIT_LNG });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(TEAM_NO_LOCATION_ERROR);
    });

    it('should return 400 when campaign is not active', async () => {
      const campaignRepo = AppDataSource.getRepository(Campaign);
      const teamRepo = AppDataSource.getRepository(Team);
      const userRepo = AppDataSource.getRepository(User);
      const expiredCampaign = await campaignRepo.save({
        campaignName: 'Expired Campaign',
        startDate: '2020-01-01',
        endDate: '2020-12-31',
        latitude: UIT_LAT,
        longitude: UIT_LNG,
        checkInRadius: 100,
      });
      const expiredTeam = await teamRepo.save({
        teamName: 'Expired Team',
        campaign: expiredCampaign,
        leader: { userId: leaderUserId } as any,
        checkInLatitude: UIT_LAT,
        checkInLongitude: UIT_LNG,
        checkInRadius: 100,
        isDeleted: 0,
      } as any);
      const volunteer = await userRepo.findOneByOrFail({ userId: volunteerUserId });
      volunteer.team = expiredTeam;
      await userRepo.save(volunteer);

      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: expiredCampaign.campaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(res.body.error).toBe(CHECKIN_ERRORS.CAMPAIGN_NOT_ACTIVE);
    });

    it('should return 409 when already checked in today', async () => {
      const firstCheckInRes = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(firstCheckInRes.status).toBe(HTTP_STATUS.CREATED);
      expect(firstCheckInRes.body.success).toBe(true);

      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(res.status).toBe(HTTP_STATUS.CONFLICT);
      expect(res.body.error).toBe(CHECKIN_ERRORS.ALREADY_CHECKED_IN);
    });

    it('should return 403 when out of radius', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT + 0.01,
          longitude: UIT_LNG + 0.01,
        });

      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
      expect(res.body.error).toBe(CHECKIN_ERRORS.OUT_OF_RANGE);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    it('should return 400 for invalid body', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: 'not-a-number',
          latitude: 999,
        });

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should reject admin check-in when admin is not assigned to a team in campaign', async () => {
      const res = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(TEAM_NOT_ASSIGNED_ERROR);
    });
  });

  describe('GET /api/checkin/history', () => {
    it('should return empty array when no check-ins', async () => {
      const res = await request(app)
        .get('/api/checkin/history')
        .set('Authorization', `Bearer ${volunteerToken}`);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return check-in history for current user', async () => {
      const checkInRes = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${volunteerToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(checkInRes.status).toBe(HTTP_STATUS.CREATED);
      expect(checkInRes.body.success).toBe(true);

      const res = await request(app)
        .get('/api/checkin/history')
        .set('Authorization', `Bearer ${volunteerToken}`);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].campaignId).toBe(activeCampaignId);
      expect(res.body.data[0].campaign).toBeDefined();
    });

    it('should not return other users check-ins', async () => {
      const otherCheckInRes = await request(app)
        .post('/api/checkin')
        .set('Authorization', `Bearer ${otherVolunteerToken}`)
        .send({
          campaignId: activeCampaignId,
          latitude: UIT_LAT,
          longitude: UIT_LNG,
        });

      expect(otherCheckInRes.status).toBe(HTTP_STATUS.CREATED);
      expect(otherCheckInRes.body.success).toBe(true);

      const res = await request(app)
        .get('/api/checkin/history')
        .set('Authorization', `Bearer ${volunteerToken}`);

      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.data).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/checkin/history');
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });
  });
});
