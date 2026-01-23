import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCampaignPhotoPostTeam1769193138220 implements MigrationInterface {
    name = 'FixCampaignPhotoPostTeam1769193138220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"))`);
        await queryRunner.query(`INSERT INTO "temporary_Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId" FROM "Campaign"`);
        await queryRunner.query(`DROP TABLE "Campaign"`);
        await queryRunner.query(`ALTER TABLE "temporary_Campaign" RENAME TO "Campaign"`);
        await queryRunner.query(`CREATE TABLE "temporary_Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"))`);
        await queryRunner.query(`INSERT INTO "temporary_Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description" FROM "Campaign"`);
        await queryRunner.query(`DROP TABLE "Campaign"`);
        await queryRunner.query(`ALTER TABLE "temporary_Campaign" RENAME TO "Campaign"`);
        await queryRunner.query(`CREATE TABLE "temporary_Post" ("PostId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text NOT NULL, "Content" text NOT NULL, "Status" text NOT NULL DEFAULT ('draft'), "IsDeleted" integer NOT NULL DEFAULT (0), "CampaignId" integer, "AuthorId" integer, "CreatedAt" text NOT NULL, "UpdatedAt" text NOT NULL, CONSTRAINT "FK_51a3a7d663468309804847743f3" FOREIGN KEY ("AuthorId") REFERENCES "User" ("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0105963ac5cc91ffdfd36d93cb8" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Post"("PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId") SELECT "PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId" FROM "Post"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`ALTER TABLE "temporary_Post" RENAME TO "Post"`);
        await queryRunner.query(`CREATE TABLE "temporary_Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, "TeamId" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"), CONSTRAINT "FK_8895cdb912435e6d02b3f3de3fe" FOREIGN KEY ("PostID") REFERENCES "Post" ("PostId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID" FROM "Photo"`);
        await queryRunner.query(`DROP TABLE "Photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_Photo" RENAME TO "Photo"`);
        await queryRunner.query(`CREATE TABLE "temporary_Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, "TeamId" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"), CONSTRAINT "FK_8895cdb912435e6d02b3f3de3fe" FOREIGN KEY ("PostID") REFERENCES "Post" ("PostId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_019171a2593cbad83a264d2a494" FOREIGN KEY ("TeamId") REFERENCES "Team" ("TeamId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID", "TeamId") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID", "TeamId" FROM "Photo"`);
        await queryRunner.query(`DROP TABLE "Photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_Photo" RENAME TO "Photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Photo" RENAME TO "temporary_Photo"`);
        await queryRunner.query(`CREATE TABLE "Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, "TeamId" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"), CONSTRAINT "FK_8895cdb912435e6d02b3f3de3fe" FOREIGN KEY ("PostID") REFERENCES "Post" ("PostId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID", "TeamId") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID", "TeamId" FROM "temporary_Photo"`);
        await queryRunner.query(`DROP TABLE "temporary_Photo"`);
        await queryRunner.query(`ALTER TABLE "Photo" RENAME TO "temporary_Photo"`);
        await queryRunner.query(`CREATE TABLE "Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"), CONSTRAINT "FK_8895cdb912435e6d02b3f3de3fe" FOREIGN KEY ("PostID") REFERENCES "Post" ("PostId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID" FROM "temporary_Photo"`);
        await queryRunner.query(`DROP TABLE "temporary_Photo"`);
        await queryRunner.query(`ALTER TABLE "Post" RENAME TO "temporary_Post"`);
        await queryRunner.query(`CREATE TABLE "Post" ("PostId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text NOT NULL, "Content" text NOT NULL, "Status" text NOT NULL DEFAULT ('draft'), "IsDeleted" integer NOT NULL DEFAULT (0), "CampaignId" integer, "AuthorId" integer, CONSTRAINT "FK_51a3a7d663468309804847743f3" FOREIGN KEY ("AuthorId") REFERENCES "User" ("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0105963ac5cc91ffdfd36d93cb8" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Post"("PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId") SELECT "PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId" FROM "temporary_Post"`);
        await queryRunner.query(`DROP TABLE "temporary_Post"`);
        await queryRunner.query(`ALTER TABLE "Campaign" RENAME TO "temporary_Campaign"`);
        await queryRunner.query(`CREATE TABLE "Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"))`);
        await queryRunner.query(`INSERT INTO "Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description" FROM "temporary_Campaign"`);
        await queryRunner.query(`DROP TABLE "temporary_Campaign"`);
        await queryRunner.query(`ALTER TABLE "Campaign" RENAME TO "temporary_Campaign"`);
        await queryRunner.query(`CREATE TABLE "Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"), CONSTRAINT "FK_89eeebb5ce902947178040185eb" FOREIGN KEY ("UserId") REFERENCES "User" ("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId" FROM "temporary_Campaign"`);
        await queryRunner.query(`DROP TABLE "temporary_Campaign"`);
    }

}
