import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhoneNumber1769042360738 implements MigrationInterface {
    name = 'AddUserPhoneNumber1769042360738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_User" ("UserId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "FullName" text NOT NULL, "Mssv" text, "Class" text, "Email" text NOT NULL, "TeamId" integer, "AccId" integer, "PhoneNumber" text, CONSTRAINT "REL_ddb7628cc78eece20794d21b9d" UNIQUE ("AccId"), CONSTRAINT "UQ_2f56f7040c2b05fc8f08a113f72" UNIQUE ("Email"), CONSTRAINT "FK_ddb7628cc78eece20794d21b9d2" FOREIGN KEY ("AccId") REFERENCES "Account" ("AccID") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_95eee988e3f682d898220d04a7a" FOREIGN KEY ("TeamId") REFERENCES "Team" ("TeamId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_User"("UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId") SELECT "UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId" FROM "User"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "temporary_User" RENAME TO "User"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" RENAME TO "temporary_User"`);
        await queryRunner.query(`CREATE TABLE "User" ("UserId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "FullName" text NOT NULL, "Mssv" text, "Class" text, "Email" text NOT NULL, "TeamId" integer, "AccId" integer, CONSTRAINT "REL_ddb7628cc78eece20794d21b9d" UNIQUE ("AccId"), CONSTRAINT "UQ_2f56f7040c2b05fc8f08a113f72" UNIQUE ("Email"), CONSTRAINT "FK_ddb7628cc78eece20794d21b9d2" FOREIGN KEY ("AccId") REFERENCES "Account" ("AccID") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_95eee988e3f682d898220d04a7a" FOREIGN KEY ("TeamId") REFERENCES "Team" ("TeamId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "User"("UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId") SELECT "UserId", "FullName", "Mssv", "Class", "Email", "TeamId", "AccId" FROM "temporary_User"`);
        await queryRunner.query(`DROP TABLE "temporary_User"`);
    }

}
