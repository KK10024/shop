import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732066364830 implements MigrationInterface {
    name = 'NewMigration1732066364830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 배송지 주소 테이블 생성
        await queryRunner.query(`CREATE TABLE "delivery_address" (
            "id" SERIAL NOT NULL, 
            "recipientName" character varying NOT NULL, 
            "phone" character varying NOT NULL, 
            "address" character varying NOT NULL, 
            "isDefault" boolean NOT NULL DEFAULT false, 
            "userUuid" uuid, 
            CONSTRAINT "PK_00581098daef1f881bb3d17a0cd" PRIMARY KEY ("id")
        )`);

        // 상품 주문 테이블 생성
        await queryRunner.query(`CREATE TABLE "goods_order" (
            "id" SERIAL NOT NULL, 
            "status" character varying NOT NULL, 
            "goodsId" integer, 
            "userUuid" uuid, 
            CONSTRAINT "PK_41c92cd0a02f8cd85dc00831388" PRIMARY KEY ("id")
        )`);

        // 기존의 gender 열을 DROP 후 NOT NULL로 추가하기 전에 기본값을 설정
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying DEFAULT 'unknown'`);
        
        // user 테이블에 gender 열을 NOT NULL로 변경
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" SET NOT NULL`);

        // 배송지 주소와 상품 주문 테이블의 외래 키 추가
        await queryRunner.query(`ALTER TABLE "delivery_address" 
            ADD CONSTRAINT "FK_8281ba04855f0e30ed773a89330" 
            FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") 
            ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "goods_order" 
            ADD CONSTRAINT "FK_67c1eed88914a1dc897c7318883" 
            FOREIGN KEY ("goodsId") REFERENCES "goods"("id") 
            ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "goods_order" 
            ADD CONSTRAINT "FK_c65a4d2063c6abca148a290504a" 
            FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") 
            ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 외래 키 제약 조건을 제거
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_c65a4d2063c6abca148a290504a"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_67c1eed88914a1dc897c7318883"`);
        await queryRunner.query(`ALTER TABLE "delivery_address" DROP CONSTRAINT "FK_8281ba04855f0e30ed773a89330"`);

        // gender 열을 DROP 후, 다시 char 타입으로 변경
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying`);

        // 생성된 테이블을 삭제
        await queryRunner.query(`DROP TABLE "goods_order"`);
        await queryRunner.query(`DROP TABLE "delivery_address"`);
    }
}