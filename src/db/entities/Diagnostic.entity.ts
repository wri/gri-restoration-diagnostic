import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm'
import { Assessment } from './Assessment.entity'
import { Question } from './Question.entity'

@Entity('diagnostic')
@Unique(['version', 'language'])
export class Diagnostic {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar' })
  version!: string

  @Column({ type: 'varchar' })
  language!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @OneToMany(() => Assessment, (assessment) => assessment.diagnostic)
  assessments!: Assessment[]

  @OneToMany(() => Question, (question) => question.diagnostic)
  questions!: Question[]
}
