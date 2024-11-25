import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732498521552 implements MigrationInterface {
    name = 'NewMigration1732498521552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "goods_order" ALTER COLUMN "quantity" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_order" ALTER COLUMN "quantity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "views"`);
    }

}
