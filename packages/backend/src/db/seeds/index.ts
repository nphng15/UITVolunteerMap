import { AppDataSource } from "../data-source.js";
import { seedRoles } from "./roles.seed.js";

const runSeed = async () => {
    try {
        const seedDataSource = AppDataSource.setOptions({
            logging: false,
            migrations: []
        });
        await seedDataSource.initialize();
        console.log("Loading seeds...");

        await seedRoles(AppDataSource);

        console.log("Completed seeding");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

runSeed();