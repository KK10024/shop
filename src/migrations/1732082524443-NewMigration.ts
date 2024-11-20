import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732082524443 implements MigrationInterface {
    name = 'NewMigration1732082524443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_c65a4d2063c6abca148a290504a"`);
        await queryRunner.query(`ALTER TABLE "goods_order" RENAME COLUMN "userUuid" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD CONSTRAINT "FK_46a48b51c93c13e6bcedb3bcadb" FOREIGN KEY ("userId") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_46a48b51c93c13e6bcedb3bcadb"`);
        await queryRunner.query(`ALTER TABLE "goods_order" RENAME COLUMN "userId" TO "userUuid"`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD CONSTRAINT "FK_c65a4d2063c6abca148a290504a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
