import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732416647113 implements MigrationInterface {
    name = 'NewMigration1732416647113'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TYPE "public"."image_type_enum" AS ENUM('PRODUCT', 'USER', 'CATEGORY')`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "type" "public"."image_type_enum" NOT NULL DEFAULT 'PRODUCT', "entityId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        // await queryRunner.query(`ALTER TABLE "goods_order" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`
            CREATE TYPE "public"."user_gender_enum" AS ENUM('남성', '여성');
          `);
          await queryRunner.query(`
            ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL DEFAULT '남성';
          `);
        await queryRunner.query(`ALTER TABLE "goods" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "size"`);
        await queryRunner.query(`CREATE TYPE "public"."goods_size_enum" AS ENUM('S(90)', 'M(95)', 'L(100)', 'XL(105)', 'XXL(110)')`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "size" "public"."goods_size_enum" NOT NULL DEFAULT 'M(95)'`);
        await queryRunner.query(`ALTER TABLE "goods_order" ADD CONSTRAINT "FK_3845d76a27566b1c3c6bb87a3cb" FOREIGN KEY ("addressId") REFERENCES "delivery_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_31bbe988996fb854a64c1316dc1" FOREIGN KEY ("entityId") REFERENCES "goods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_31bbe988996fb854a64c1316dc1"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP CONSTRAINT "FK_3845d76a27566b1c3c6bb87a3cb"`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "size"`);
        await queryRunner.query(`DROP TYPE "public"."goods_size_enum"`);
        await queryRunner.query(`ALTER TABLE "goods" ADD "size" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goods" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" character varying NOT NULL DEFAULT 'unknown'`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "goods" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "goods_order" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "menu"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TYPE "public"."image_type_enum"`);
    }

}
