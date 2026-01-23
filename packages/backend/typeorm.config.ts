import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from './src/entities/User.js';
import { Account } from './src/entities/Account.js';
import { Role } from './src/entities/Role.js';
import { Team } from './src/entities/Team.js';
import { Campaign } from './src/entities/Campaign.js';
import { Post } from './src/entities/Post.js';
import { Photo } from './src/entities/Photo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, 'src/data/database.sqlite'),
  synchronize: false,
  logging: true,
  entities: [User, Account, Role, Team, Campaign, Post, Photo],
  migrations: [join(__dirname, 'src/db/migrations/**/*.ts')],
  subscribers: [],
});
