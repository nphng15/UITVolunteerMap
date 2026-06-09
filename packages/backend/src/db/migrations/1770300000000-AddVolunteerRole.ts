import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVolunteerRole1770300000000 implements MigrationInterface {
    name = 'AddVolunteerRole1770300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT OR IGNORE INTO "Role" ("RoleId", "RoleName") VALUES (3, 'volunteer')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "Role" WHERE "RoleId" = 3`);
    }
}
