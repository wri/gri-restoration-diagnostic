import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771887048843 implements MigrationInterface {
    name = 'Migration1771887048843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "UQ_626f3fbf79785b13f86f6a331e7"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "UQ_4622de9e3efad53b8fb060ad968" UNIQUE ("id", "assessment_id", "question_id", "updated_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "UQ_4622de9e3efad53b8fb060ad968"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "UQ_626f3fbf79785b13f86f6a331e7" UNIQUE ("assessment_id", "question_id")`);
    }

}
