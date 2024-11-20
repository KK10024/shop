import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1732068612844 implements MigrationInterface {
    name = 'NewMigration1732068612844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."image_type_enum" AS ENUM('PRODUCT', 'USER', 'CATEGORY')`);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "type" "public"."image_type_enum" NOT NULL DEFAULT 'PRODUCT', "entityId" integer NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" SET DEFAULT 'unknown'`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TYPE "public"."image_type_enum"`);
    }

}
