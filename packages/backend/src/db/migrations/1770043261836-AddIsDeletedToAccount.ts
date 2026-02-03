import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIsDeletedToAccount1700000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("Account", new TableColumn({
            name: "IsDeleted",
            type: "boolean",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("Account", "IsDeleted");
    }
}