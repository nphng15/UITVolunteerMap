import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1769078305873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT OR IGNORE INTO "Role" ("RoleName") VALUES ('admin');`);
        await queryRunner.query(`INSERT OR IGNORE INTO "Role" ("RoleName") VALUES ('leader');`);

        const adminRole = await queryRunner.query(`SELECT * FROM "Role" WHERE "RoleName" = 'admin' LIMIT 1`);
        const leaderRole = await queryRunner.query(`SELECT * FROM "Role" WHERE "RoleName" = 'leader' LIMIT 1`);

        const adminId = adminRole[0].id || adminRole[0].RoleId || adminRole[0].roleId;
        const leaderId = leaderRole[0].id || leaderRole[0].RoleId || leaderRole[0].roleId;

        await queryRunner.query(`
            INSERT OR IGNORE INTO "Account" ("Username", "Password", "RoleId", "CreateAt")
            VALUES (
                'admin', 
                '$2a$12$uuWlOxqXca4O/6XGEnCO2Og95GSilA7VC2raUHoycjGx9yIaGKYAm', 
                ${adminId}, 
                datetime('now')
            );
        `);

        await queryRunner.query(`
            INSERT OR IGNORE INTO "Account" ("Username", "Password", "RoleId", "CreateAt")
            VALUES (
                'leader', 
                '$2a$12$bYZtua7LSb7pwBLP4iN0hej72rl9qKHpA3yrgAZ.ENE5Wu3r2F4r6', 
                ${leaderId}, 
                datetime('now')
            );
        `);

        await queryRunner.query(`
            INSERT OR IGNORE INTO "Account" ("Username", "Password", "RoleId", "CreateAt")
            VALUES (
                'leader2', 
                '$2a$12$x8d.3TOfWIt0jAlWMvsQFO67l5Dq2KuO1OnSE44j3Bzza6B314uDW', 
                ${leaderId}, 
                datetime('now')
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "Account" WHERE "Username" IN ('admin', 'leader', 'leader2');`);
        await queryRunner.query(`DELETE FROM "Role" WHERE "RoleName" IN ('admin', 'leader');`);
    }
}