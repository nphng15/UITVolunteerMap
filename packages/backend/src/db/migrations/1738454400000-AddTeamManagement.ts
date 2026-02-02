import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamManagement1738454400000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add leaderId to Team
        await queryRunner.query(`ALTER TABLE "Team" ADD COLUMN "LeaderId" integer`);
        
        // Add imageUrl to Team
        await queryRunner.query(`ALTER TABLE "Team" ADD COLUMN "ImageUrl" text`);
        
        // Add isDeleted to Team
        await queryRunner.query(`ALTER TABLE "Team" ADD COLUMN "IsDeleted" integer NOT NULL DEFAULT (0)`);
        
        // Add isDeleted to User
        await queryRunner.query(`ALTER TABLE "User" ADD COLUMN "IsDeleted" integer NOT NULL DEFAULT (0)`);
        
        // Add isDeleted to Photo
        await queryRunner.query(`ALTER TABLE "Photo" ADD COLUMN "IsDeleted" integer NOT NULL DEFAULT (0)`);
        
        // Create temporary Team table with foreign key
        await queryRunner.query(`CREATE TABLE "temporary_Team" ("TeamId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "TeamName" text NOT NULL, "Description" text, "CampaignId" integer, "LeaderId" integer, "ImageUrl" text, "IsDeleted" integer NOT NULL DEFAULT (0), CONSTRAINT "UQ_042036b4e6cf6a153ae32558546" UNIQUE ("TeamName"), CONSTRAINT "FK_fbc2094d592cb225a72658160e3" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_Team_Leader" FOREIGN KEY ("LeaderId") REFERENCES "User" ("UserId") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        
        await queryRunner.query(`INSERT INTO "temporary_Team"("TeamId", "TeamName", "Description", "CampaignId", "LeaderId", "ImageUrl", "IsDeleted") SELECT "TeamId", "TeamName", "Description", "CampaignId", "LeaderId", "ImageUrl", "IsDeleted" FROM "Team"`);
        
        await queryRunner.query(`DROP TABLE "Team"`);
        
        await queryRunner.query(`ALTER TABLE "temporary_Team" RENAME TO "Team"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse Team changes
        await queryRunner.query(`CREATE TABLE "temporary_Team" ("TeamId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "TeamName" text NOT NULL, "Description" text, "CampaignId" integer, CONSTRAINT "UQ_042036b4e6cf6a153ae32558546" UNIQUE ("TeamName"), CONSTRAINT "FK_fbc2094d592cb225a72658160e3" FOREIGN KEY ("CampaignId") REFERENCES "Campaign" ("CampaignId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        
        await queryRunner.query(`INSERT INTO "temporary_Team"("TeamId", "TeamName", "Description", "CampaignId") SELECT "TeamId", "TeamName", "Description", "CampaignId" FROM "Team"`);
        
        await queryRunner.query(`DROP TABLE "Team"`);
        
        await queryRunner.query(`ALTER TABLE "temporary_Team" RENAME TO "Team"`);
        
        // Remove isDeleted from Photo
        await queryRunner.query(`ALTER TABLE "Photo" DROP COLUMN "IsDeleted"`);
        
        // Remove isDeleted from User
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "IsDeleted"`);
    }

}
