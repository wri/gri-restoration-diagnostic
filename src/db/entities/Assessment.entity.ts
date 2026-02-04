import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Lead } from './Lead.entity'
import { Region } from './Region.entity'
import { Diagnostic } from './Diagnostic.entity'
import { Answer } from './Answer.entity'
import { CustomTopic } from './CustomTopic.entity'
import { Contributor } from './Contributor.entity'

export enum ProjectType {
  GEF_8 = 'GEF_8',
  WRI = 'WRI',
  OTHER = 'other',
}

export enum AssessmentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt!: Date | null

  @Column({ name: 'diagnostic_year', type: 'varchar' })
  diagnosticYear!: string

  @Column({
    name: 'project_type',
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.OTHER,
  })
  projectType!: ProjectType

  @Column({
    type: 'varchar',
    default: AssessmentStatus.DRAFT,
  })
  status!: AssessmentStatus

  @ManyToOne(() => Lead, (lead) => lead.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead!: Lead

  @Column({ name: 'lead_id' })
  leadId!: string

  @ManyToOne(() => Region, (region) => region.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'region_id' })
  region!: Region

  @Column({ name: 'region_id' })
  regionId!: string

  @ManyToOne(() => Diagnostic, (diagnostic) => diagnostic.assessments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'diagnostic_id' })
  diagnostic!: Diagnostic

  @Column({ name: 'diagnostic_id' })
  diagnosticId!: string

  @OneToMany(() => Answer, (answer) => answer.assessment)
  answers!: Answer[]

  @OneToMany(() => CustomTopic, (customTopic) => customTopic.assessment)
  customTopics!: CustomTopic[]

  @OneToMany(() => Contributor, (contributor) => contributor.assessment)
  contributors!: Contributor[]
}
