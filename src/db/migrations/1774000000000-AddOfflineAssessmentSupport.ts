import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOfflineAssessmentSupport1774000000000 implements MigrationInterface {
  name = 'AddOfflineAssessmentSupport1774000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add contact_agreement column to lead table
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "contact_agreement" boolean DEFAULT false`,
    )

    // Add 'offline' value to the assessments_status_enum Postgres type
    await queryRunner.query(
      `ALTER TYPE "public"."assessments_status_enum" ADD VALUE IF NOT EXISTS 'offline'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove contact_agreement column
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "contact_agreement"`)

    // Note: Removing a value from a Postgres enum requires recreating the type.
    // This down migration recreates the enum without 'offline' and migrates existing data.
    await queryRunner.query(
      `ALTER TABLE "assessments" ALTER COLUMN "status" TYPE varchar USING status::text`,
    )
    await queryRunner.query(`DROP TYPE "public"."assessments_status_enum"`)
    await queryRunner.query(
      `CREATE TYPE "public"."assessments_status_enum" AS ENUM('draft', 'in-progress', 'completed', 'archived')`,
    )
    await queryRunner.query(
      `ALTER TABLE "assessments" ALTER COLUMN "status" TYPE "public"."assessments_status_enum" USING status::"public"."assessments_status_enum"`,
    )
  }
}
