import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm'
import { Assessment } from './Assessment.entity'
import { Question } from './Question.entity'
import { Strategy } from './Strategy.entity'

export enum AnswerValue {
  YES = 'yes',
  PARTLY = 'partly',
  NO = 'no',
}

@Entity('answer')
@Unique(['assessment', 'question'])
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: AnswerValue, nullable: true })
  value!: AnswerValue | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne(() => Assessment, (assessment) => assessment.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  @Index()
  assessment!: Assessment

  @Column({ name: 'assessment_id' })
  assessmentId!: string

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'question_id' })
  @Index()
  question!: Question

  @Column({ name: 'question_id' })
  questionId!: string

  @OneToMany(() => Strategy, (strategy) => strategy.answer)
  strategies!: Strategy[]
}
