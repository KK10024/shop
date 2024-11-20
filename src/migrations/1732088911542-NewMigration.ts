import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1732088911542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // price 컬럼의 null 값을 0으로 업데이트
    await queryRunner.query('UPDATE "goods" SET "price" = 0 WHERE "price" IS NULL');
    
    // price 컬럼을 NOT NULL로 변경
    await queryRunner.query('ALTER TABLE "goods" ALTER COLUMN "price" SET NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 롤백시 price 컬럼을 nullable로 되돌림
    await queryRunner.query('ALTER TABLE "goods" ALTER COLUMN "price" DROP NOT NULL');
  }
}