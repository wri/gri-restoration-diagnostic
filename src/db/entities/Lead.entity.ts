import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Assessment } from './Assessment.entity'
import { CustomTopic } from './CustomTopic.entity'
import { Strategy } from './Strategy.entity'
import { Contributor } from './Contributor.entity'

@Entity('lead')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'job_title', type: 'varchar', nullable: true })
  jobTitle!: string | null

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', unique: true })
  email!: string

  @Column({ type: 'varchar', nullable: true })
  organization!: string | null

  @Column({ type: 'varchar', nullable: true })
  role!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @OneToMany(() => Assessment, (assessment) => assessment.lead)
  assessments!: Assessment[]

  @OneToMany(() => CustomTopic, (customTopic) => customTopic.createdBy)
  customTopics!: CustomTopic[]

  @OneToMany(() => Strategy, (strategy) => strategy.createdBy)
  strategies!: Strategy[]

  @OneToMany(() => Contributor, (contributor) => contributor.lead)
  contributions!: Contributor[]
}
