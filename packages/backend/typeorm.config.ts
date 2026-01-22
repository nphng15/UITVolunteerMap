import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'sqlite',
  database: join(__dirname, 'src/data/database.sqlite'),
  synchronize: false,
  logging: true,
  entities: [join(__dirname, 'src/entities/**/*.ts')],
  migrations: [
    join(__dirname, 'src/db/migrations/**/*.ts'),
    join(__dirname, 'src/db/seeds/**/*.ts')
  ],
  subscribers: [],
});
