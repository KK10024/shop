import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732091142526 implements MigrationInterface {
    name = 'NewMigration1732091142526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "deliveryAddressId" integer`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD CONSTRAINT "FK_025ee3a444d740ee9ca690627c1" FOREIGN KEY ("deliveryAddressId") REFERENCES "delivery_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_025ee3a444d740ee9ca690627c1"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "deliveryAddressId"`);
    }

}
