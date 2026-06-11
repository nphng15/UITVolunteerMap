import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source.js";
import { seedAccounts } from "./accounts.seed.js";
import { seedCampaigns } from "./campaigns.seed.js";
import { seedPosts } from "./posts.seed.js";
import { seedRoles } from "./roles.seed.js";
import { seedTeams } from "./teams.seed.js";
import { seedVolunteers } from "./volunteers.seed.js";

export const runSeeds = async (dataSource: DataSource) => {
  console.log("Loading seeds...");
  await seedRoles(dataSource);
  await seedAccounts(dataSource);
  await seedCampaigns(dataSource);
  await seedTeams(dataSource);
  await seedVolunteers(dataSource);
  await seedPosts(dataSource);
  console.log("Completed seeding");
};

const runSeedCli = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await runSeeds(AppDataSource);
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
  runSeedCli();
}
