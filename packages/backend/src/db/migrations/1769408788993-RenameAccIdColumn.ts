import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAccIdColumn1706240000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("Account", "AccID", "AccId");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("Account", "AccId", "AccID");
    }

}