import { MigrationInterface, QueryRunner } from "typeorm";

export class Baseline1769042239658 implements MigrationInterface {
    name = 'Baseline1769042239658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("UserId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "FullName" text NOT NULL, "Mssv" text, "Class" text, "Email" text NOT NULL, "TeamId" integer, "AccId" integer, CONSTRAINT "UQ_2f56f7040c2b05fc8f08a113f72" UNIQUE ("Email"), CONSTRAINT "REL_ddb7628cc78eece20794d21b9d" UNIQUE ("AccId"))`);
        await queryRunner.query(`CREATE TABLE "Team" ("TeamId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "TeamName" text NOT NULL, "Description" text, "CampaignId" integer, CONSTRAINT "UQ_042036b4e6cf6a153ae32558546" UNIQUE ("TeamName"))`);
        await queryRunner.query(`CREATE TABLE "Role" ("RoleId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "RoleName" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"))`);
        await queryRunner.query(`CREATE TABLE "Post" ("PostId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text NOT NULL, "Content" text NOT NULL, "Status" text NOT NULL DEFAULT ('draft'), "IsDeleted" integer NOT NULL DEFAULT (0), "CampaignId" integer, "AuthorId" integer)`);
        await queryRunner.query(`CREATE TABLE "Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"))`);
        await queryRunner.query(`CREATE TABLE "Account" ("AccID" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Username" text NOT NULL, "Password" text NOT NULL, "RoleId" integer NOT NULL, "CreateAt" text, "UpdatedAt" text, CONSTRAINT "UQ_412a2768f8054c28b160cca18f6" UNIQUE ("Username"))`);
        await queryRunner.query(`CREATE TABLE "temporary_User" ("UserId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "FullName" text NOT NULL, "Mssv" text, "Class" text, "Email" text NOT NULL, "TeamId" integer, "AccId" integer, CONSTRAINT "UQ_2f56f7040c2b05fc8f08a113f72" UNIQUE ("Email"), CONSTRAINT "REL_ddb7628cc78eece20794d21b9d" UNIQUE ("AccId"), CONSTRAINT "FK_95eee988e3f682d898220d04a7a" FOREIGN KEY ("TeamId") REFERENCES "Team" ("TeamId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ddb7628cc78eece20794d21b9d2" FOREIGN KEY ("AccId") REFERENCES "Account" ("AccID") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_User"("UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId") SELECT "UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
        await queryRunner.query(`CREATE TABLE "temporary_Team" ("TeamId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "TeamName" text NOT NULL, "Description" text, "CampaignId" integer, CONSTRAINT "UQ_042036b4e6cf6a153ae32558546" UNIQUE ("TeamName"), CONSTRAINT "FK_fbc2094d592cb225a72658160e3" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Team"("TeamId", "TeamName", "Description", "CampaignId") SELECT "TeamId", "TeamName", "Description", "CampaignId" FROM "Team"`);
        await queryRunner.query(`DROP TABLE "Team"`);
        await queryRunner.query(`ALTER TABLE "temporary_Team" RENAME TO "Team"`);
        await queryRunner.query(`CREATE TABLE "temporary_Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"), CONSTRAINT "FK_8895cdb912435e6d02b3f3de3fe" FOREIGN KEY ("PostID") REFERENCES "Post" ("PostId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID" FROM "Photo"`);
        await queryRunner.query(`DROP TABLE "Photo"`);
        await queryRunner.query(`ALTER TABLE "temporary_Photo" RENAME TO "Photo"`);
        await queryRunner.query(`CREATE TABLE "temporary_Post" ("PostId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text NOT NULL, "Content" text NOT NULL, "Status" text NOT NULL DEFAULT ('draft'), "IsDeleted" integer NOT NULL DEFAULT (0), "CampaignId" integer, "AuthorId" integer, CONSTRAINT "FK_0105963ac5cc91ffdfd36d93cb8" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_51a3a7d663468309804847743f3" FOREIGN KEY ("AuthorId") REFERENCES "User" ("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Post"("PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId") SELECT "PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId" FROM "Post"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`ALTER TABLE "temporary_Post" RENAME TO "Post"`);
        await queryRunner.query(`CREATE TABLE "temporary_Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"), CONSTRAINT "FK_89eeebb5ce902947178040185eb" FOREIGN KEY ("UserId") REFERENCES "User" ("UserId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId" FROM "Campaign"`);
        await queryRunner.query(`DROP TABLE "Campaign"`);
        await queryRunner.query(`ALTER TABLE "temporary_Campaign" RENAME TO "Campaign"`);
        await queryRunner.query(`CREATE TABLE "temporary_Account" ("AccID" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Username" text NOT NULL, "Password" text NOT NULL, "RoleId" integer NOT NULL, "CreateAt" text, "UpdatedAt" text, CONSTRAINT "UQ_412a2768f8054c28b160cca18f6" UNIQUE ("Username"), CONSTRAINT "FK_26f742c115858ce3ceaced87d77" FOREIGN KEY ("RoleId") REFERENCES "Role" ("RoleId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Account"("AccID", "Username", "Password", "RoleId", "CreateAt", "UpdatedAt") SELECT "AccID", "Username", "Password", "RoleId", "CreateAt", "UpdatedAt" FROM "Account"`);
        await queryRunner.query(`DROP TABLE "Account"`);
        await queryRunner.query(`ALTER TABLE "temporary_Account" RENAME TO "Account"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Account" RENAME TO "temporary_Account"`);
        await queryRunner.query(`CREATE TABLE "Account" ("AccID" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Username" text NOT NULL, "Password" text NOT NULL, "RoleId" integer NOT NULL, "CreateAt" text, "UpdatedAt" text, CONSTRAINT "UQ_412a2768f8054c28b160cca18f6" UNIQUE ("Username"))`);
        await queryRunner.query(`INSERT INTO "Account"("AccID", "Username", "Password", "RoleId", "CreateAt", "UpdatedAt") SELECT "AccID", "Username", "Password", "RoleId", "CreateAt", "UpdatedAt" FROM "temporary_Account"`);
        await queryRunner.query(`DROP TABLE "temporary_Account"`);
        await queryRunner.query(`ALTER TABLE "Campaign" RENAME TO "temporary_Campaign"`);
        await queryRunner.query(`CREATE TABLE "Campaign" ("CampaignId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "CampaignName" text NOT NULL, "StartDate" text NOT NULL, "EndDate" text NOT NULL, "Description" text, "UserId" integer, CONSTRAINT "UQ_c9106c4d0a3a6061cc8e6d5d4ce" UNIQUE ("CampaignName"))`);
        await queryRunner.query(`INSERT INTO "Campaign"("CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId") SELECT "CampaignId", "CampaignName", "StartDate", "EndDate", "Description", "UserId" FROM "temporary_Campaign"`);
        await queryRunner.query(`DROP TABLE "temporary_Campaign"`);
        await queryRunner.query(`ALTER TABLE "Post" RENAME TO "temporary_Post"`);
        await queryRunner.query(`CREATE TABLE "Post" ("PostId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text NOT NULL, "Content" text NOT NULL, "Status" text NOT NULL DEFAULT ('draft'), "IsDeleted" integer NOT NULL DEFAULT (0), "CampaignId" integer, "AuthorId" integer)`);
        await queryRunner.query(`INSERT INTO "Post"("PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId") SELECT "PostId", "Title", "Content", "Status", "IsDeleted", "CampaignId", "AuthorId" FROM "temporary_Post"`);
        await queryRunner.query(`DROP TABLE "temporary_Post"`);
        await queryRunner.query(`ALTER TABLE "Photo" RENAME TO "temporary_Photo"`);
        await queryRunner.query(`CREATE TABLE "Photo" ("PhotoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "Title" text, "ImageUrl" text NOT NULL, "UploadedAt" text NOT NULL, "PostID" integer, CONSTRAINT "UQ_92a60c2f5ae771bb7197eaf92ca" UNIQUE ("ImageUrl"))`);
        await queryRunner.query(`INSERT INTO "Photo"("PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID") SELECT "PhotoId", "Title", "ImageUrl", "UploadedAt", "PostID" FROM "temporary_Photo"`);
        await queryRunner.query(`DROP TABLE "temporary_Photo"`);
        await queryRunner.query(`ALTER TABLE "Team" RENAME TO "temporary_Team"`);
        await queryRunner.query(`CREATE TABLE "Team" ("TeamId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "TeamName" text NOT NULL, "Description" text, "CampaignId" integer, CONSTRAINT "UQ_042036b4e6cf6a153ae32558546" UNIQUE ("TeamName"))`);
        await queryRunner.query(`INSERT INTO "Team"("TeamId", "TeamName", "Description", "CampaignId") SELECT "TeamId", "TeamName", "Description", "CampaignId" FROM "temporary_Team"`);
        await queryRunner.query(`DROP TABLE "temporary_Team"`);
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("UserId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "FullName" text NOT NULL, "Mssv" text, "Class" text, "Email" text NOT NULL, "TeamId" integer, "AccId" integer, CONSTRAINT "UQ_2f56f7040c2b05fc8f08a113f72" UNIQUE ("Email"), CONSTRAINT "REL_ddb7628cc78eece20794d21b9d" UNIQUE ("AccId"))`);
        await queryRunner.query(`INSERT INTO "User"("UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId") SELECT "UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
        await queryRunner.query(`DROP TABLE "Account"`);
        await queryRunner.query(`DROP TABLE "Campaign"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`DROP TABLE "Photo"`);
        await queryRunner.query(`DROP TABLE "Role"`);
        await queryRunner.query(`DROP TABLE "Team"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
