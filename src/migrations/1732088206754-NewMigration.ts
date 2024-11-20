import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732088206754 implements MigrationInterface {
    name = 'NewMigration1732088206754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goods_order" ADD "quantity" character varying');

        await queryRunner.query('UPDATE "goods_order" SET "quantity" = \'0\' WHERE "quantity" IS NULL');

        await queryRunner.query('ALTER TABLE "goods_order" ALTER COLUMN "quantity" SET NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "goods_order" DROP COLUMN "quantity"');
    }
}