import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamCheckInLocation1770400000000 implements MigrationInterface {
  name = 'AddTeamCheckInLocation1770400000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Team" ADD COLUMN "CheckInLatitude" real');
    await queryRunner.query('ALTER TABLE "Team" ADD COLUMN "CheckInLongitude" real');
    await queryRunner.query('ALTER TABLE "Team" ADD COLUMN "CheckInRadius" real');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "Team" DROP COLUMN "CheckInRadius"');
    await queryRunner.query('ALTER TABLE "Team" DROP COLUMN "CheckInLongitude"');
    await queryRunner.query('ALTER TABLE "Team" DROP COLUMN "CheckInLatitude"');
  }
}
