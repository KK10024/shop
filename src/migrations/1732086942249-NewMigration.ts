import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732086942249 implements MigrationInterface {
    name = 'NewMigration1732086942249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const constraints = await queryRunner.query(`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'goods_order'::regclass AND conname = 'FK_c65a4d2063c6abca148a290504a';
        `);
        
        if (constraints.length > 0) {
            await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_c65a4d2063c6abca148a290504a"`);
        }
        // 제약 조건 삭제 시도 제거
        await queryRunner.query(`
            ALTER TABLE "goods_order" RENAME COLUMN "userUuid" TO "userId"
        `);

        // 새 외래 키 제약 조건 추가
        await queryRunner.query(`
            ALTER TABLE "goods_order" ADD CONSTRAINT "FK_46a48b51c93c13e6bcedb3bcadb" FOREIGN KEY ("userId") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`ALTER TABLE "image" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "image" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "image" ADD "deletedAt" TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "goods" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "deletedAt" TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "goods_order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "deletedAt" TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);

        // Add foreign key constraint
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_31bbe988996fb854a64c1316dc1" FOREIGN KEY ("entityId") REFERENCES "goods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint first to ensure we can drop the column safely
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_31bbe988996fb854a64c1316dc1"`);

        // Drop columns in reverse order to avoid any issues with dependencies
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);

        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "createdAt"`);

        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "createdAt"`);

        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "createdAt"`);
    }
}
