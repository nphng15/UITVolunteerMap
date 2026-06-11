import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCheckInTable1770300200000 implements MigrationInterface {
    name = 'CreateCheckInTable1770300200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CheckIn" (
            "CheckInId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "CampaignId" integer NOT NULL,
            "AccId" integer NOT NULL,
            "Latitude" real NOT NULL,
            "Longitude" real NOT NULL,
            "Distance" real NOT NULL,
            "CheckedInAt" text NOT NULL,
            CONSTRAINT "FK_checkin_campaign" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_checkin_account" FOREIGN KEY ("AccId") REFERENCES "Account" ("AccId") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "CheckIn"`);
    }
}
