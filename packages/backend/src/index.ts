import app from './app.js';
import { AppDataSource } from './db/data-source.js';
import { runSeeds } from './db/seeds/index.js';
import { seedRemoteImages } from './scripts/seedRemoteImages.js';

const PORT = process.env.PORT || 5000;

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected successfully');

    if (process.env.SEED_ON_START !== 'false') {
      await runSeeds(AppDataSource);
      await seedRemoteImages(AppDataSource);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error: Error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

export default app;
