import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCheckinPhotoAndCampaignPhoto1770300300000 implements MigrationInterface {
    name = 'AddCheckinPhotoAndCampaignPhoto1770300300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CheckIn" ADD COLUMN "ImageUrl" text`);

        await queryRunner.query(`CREATE TABLE "CampaignPhoto" (
            "CampaignPhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "CampaignId" integer NOT NULL,
            "AccId" integer NOT NULL,
            "ImageUrl" text NOT NULL,
            "Caption" text,
            "IsCheckinPhoto" integer NOT NULL DEFAULT (0),
            "IsDeleted" integer NOT NULL DEFAULT (0),
            "CreatedAt" text NOT NULL,
            CONSTRAINT "FK_campaignphoto_campaign" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_campaignphoto_account" FOREIGN KEY ("AccId") REFERENCES "Account" ("AccId") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);

        await queryRunner.query(`CREATE INDEX "IDX_campaignphoto_campaign" ON "CampaignPhoto" ("CampaignId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_campaignphoto_campaign"`);
        await queryRunner.query(`DROP TABLE "CampaignPhoto"`);
        await queryRunner.query(`ALTER TABLE "CheckIn" DROP COLUMN "ImageUrl"`);
    }
}
