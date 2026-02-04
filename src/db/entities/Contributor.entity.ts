import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm'
import { Assessment } from './Assessment.entity'
import { Lead } from './Lead.entity'

@Entity('contributor')
@Unique(['assessment', 'lead'])
export class Contributor {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'contributor_name', type: 'varchar' })
  contributorName!: string

  @Column({ type: 'varchar', nullable: true })
  role!: string | null

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date

  @ManyToOne(() => Assessment, (assessment) => assessment.contributors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  @Index()
  assessment!: Assessment

  @Column({ name: 'assessment_id' })
  assessmentId!: string

  @ManyToOne(() => Lead, (lead) => lead.contributions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'lead_id' })
  @Index()
  lead!: Lead

  @Column({ name: 'lead_id' })
  leadId!: string
}
