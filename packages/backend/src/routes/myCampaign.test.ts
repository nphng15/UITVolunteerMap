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
import { RoleEnum, HTTP_STATUS } from '@uit-volunteer-map/shared';

const JWT_SECRET = process.env.JWT_SECRET!;

const UIT_LAT = 10.8700;
const UIT_LNG = 106.8030;

describe('GET /api/users/me/campaign', () => {
  let volunteerToken: string;
  let volunteerAccId: number;
  let campaignId: number;

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

    const volunteerRole = await roleRepo.save({ roleName: RoleEnum.VOLUNTEER });

    const volunteerPass = await bcrypt.hash('volunteer123', 10);
    const volunteerAccount = await accRepo.save({
      username: 'volunteer1',
      password: volunteerPass,
      roleId: volunteerRole.roleId,
    });
    volunteerAccId = volunteerAccount.accId;

    volunteerToken = jwt.sign(
      { accId: volunteerAccount.accId, role: RoleEnum.VOLUNTEER },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    const checkInRepo = AppDataSource.getRepository(CheckIn);
    const userRepo = AppDataSource.getRepository(User);
    const teamRepo = AppDataSource.getRepository(Team);
    const campaignRepo = AppDataSource.getRepository(Campaign);

    await checkInRepo.clear();
    await userRepo.clear();
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
    campaignId = campaign.campaignId;

    const team = await teamRepo.save({
      teamName: 'Team Alpha',
      campaign: { campaignId: campaign.campaignId },
    });

    await userRepo.save({
      fullName: 'Volunteer One',
      email: 'volunteer1@uit.edu.vn',
      team: { teamId: team.teamId },
      account: { accId: volunteerAccId },
    });
  });

  it('returns the campaign with hasCheckedIn=false when there is no check-in', async () => {
    const res = await request(app)
      .get('/api/users/me/campaign')
      .set('Authorization', `Bearer ${volunteerToken}`);

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.data.campaignId).toBe(campaignId);
    expect(res.body.data.hasCheckedIn).toBe(false);
    expect(res.body.data.checkedInAt).toBeNull();
  });

  it('returns hasCheckedIn=true when there is a check-in today', async () => {
    const checkInRepo = AppDataSource.getRepository(CheckIn);
    const todayTimestamp = new Date().toISOString();
    await checkInRepo.save({
      campaignId,
      accId: volunteerAccId,
      latitude: UIT_LAT,
      longitude: UIT_LNG,
      distance: 0,
      checkedInAt: todayTimestamp,
    });

    const res = await request(app)
      .get('/api/users/me/campaign')
      .set('Authorization', `Bearer ${volunteerToken}`);

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.data.hasCheckedIn).toBe(true);
    expect(res.body.data.checkedInAt).toBe(todayTimestamp);
  });

  // Regression guard for the once-per-day bug: a check-in from a past day must
  // NOT be reported as "checked in" today.
  it('returns hasCheckedIn=false when the only check-in is from a past day', async () => {
    const checkInRepo = AppDataSource.getRepository(CheckIn);
    await checkInRepo.save({
      campaignId,
      accId: volunteerAccId,
      latitude: UIT_LAT,
      longitude: UIT_LNG,
      distance: 0,
      checkedInAt: '2020-01-01T09:00:00.000Z',
    });

    const res = await request(app)
      .get('/api/users/me/campaign')
      .set('Authorization', `Bearer ${volunteerToken}`);

    expect(res.status).toBe(HTTP_STATUS.OK);
    expect(res.body.data.hasCheckedIn).toBe(false);
    expect(res.body.data.checkedInAt).toBeNull();
  });
});
