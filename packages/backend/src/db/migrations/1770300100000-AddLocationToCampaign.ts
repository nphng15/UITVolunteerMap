import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationToCampaign1770300100000 implements MigrationInterface {
    name = 'AddLocationToCampaign1770300100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Campaign" ADD COLUMN "Latitude" real`);
        await queryRunner.query(`ALTER TABLE "Campaign" ADD COLUMN "Longitude" real`);
        await queryRunner.query(`ALTER TABLE "Campaign" ADD COLUMN "CheckInRadius" real DEFAULT 100`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Campaign" DROP COLUMN "CheckInRadius"`);
        await queryRunner.query(`ALTER TABLE "Campaign" DROP COLUMN "Longitude"`);
        await queryRunner.query(`ALTER TABLE "Campaign" DROP COLUMN "Latitude"`);
    }
}
