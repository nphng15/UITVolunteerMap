import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { AppDataSource } from '../db/data-source.js';
import { Account } from '../entities/Account.js';
import { Role } from '../entities/Role.js';
import { User } from '../entities/User.js';
import { Campaign } from '../entities/Campaign.js';
import { Team } from '../entities/Team.js';
import { Post } from '../entities/Post.js';
import { Photo } from '../entities/Photo.js';
import bcrypt from 'bcrypt';

describe('POST /api/auth/login', () => {
  
  beforeAll(async () => {
    // Khởi tạo kết nối DB In-memory và nạp đầy đủ các Entities
    if (!AppDataSource.isInitialized) {
      await AppDataSource.setOptions({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [Account, Role, User, Campaign, Team, Post, Photo], 
        migrations: [],
        subscribers: [],
      }).initialize();
    } else {
      await AppDataSource.synchronize(true);
    }

    // Làm sạch và Seed dữ liệu mẫu
    await AppDataSource.synchronize(true);
    const roleRepo = AppDataSource.getRepository(Role);
    const accRepo = AppDataSource.getRepository(Account);

    const adminRole = await roleRepo.save({ roleName: 'admin' }); 
    const leaderRole = await roleRepo.save({ roleName: 'leader' });

    const adminPass = await bcrypt.hash('admin123', 10);
    const leaderPass = await bcrypt.hash('leader123', 10);

    // Lưu Account với thuộc tính viết thường khớp với Entity Account.ts
    await accRepo.save({ 
      username: 'admin', 
      password: adminPass, 
      roleId: adminRole.roleId 
    });
    
    await accRepo.save({ 
      username: 'leader', 
      password: leaderPass, 
      roleId: leaderRole.roleId 
    });
  });

  // Test case 1: Đăng nhập Admin thành công
  it('should login with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    // Khớp với cấu trúc JSON thực tế: { token: "...", user: { username: "admin", role: "admin" } }
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      username: 'admin',
      role: 'admin',
    });
  });

  // Test case 2: Đăng nhập Leader thành công
  it('should login with valid leader credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'leader', password: 'leader123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      username: 'leader',
      role: 'leader',
    });
  });

  // Test case 3: Sai thông tin đăng nhập
  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    // Khớp với message: "Invalid username or password"
    expect(res.body.message).toBe('Invalid username or password');
  });

  // Test case 4: Để trống Username
  it('should reject empty username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: '', password: 'admin123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    // Khớp chính xác thông điệp từ Postman: "username: Username is required"
    expect(res.body.message).toBe('username: Username is required');
  });

  // Test case 5: Thiếu Password
  it('should reject missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' , password: ''});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    // Khớp với định dạng validation của Zod trong middleware
    expect(res.body.message).toContain('Password is required');
  });
});

describe('POST /api/auth/logout', () => {
  it('should logout successfully', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Khớp với message trả về trong Router
    expect(res.body.message).toBe('Logged out successfully');
  });
});