import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  // OneToMany,  // On hold - was used for strategies relation
  JoinColumn,
  Index,
  Unique,
} from 'typeorm'
import type { Assessment } from './Assessment.entity'
import type { Question } from './Question.entity'
// import { Strategy } from './Strategy.entity.candidate' // On hold

export enum AnswerValue {
  YES = 'yes',
  PARTLY = 'partly',
  NO = 'no',
  NA = 'na',
}

@Entity('answer')
@Unique(['assessment', 'question'])
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'enum', enum: AnswerValue, nullable: true })
  value!: AnswerValue | null

  @Column({ type: 'text', nullable: true })
  rationale!: string | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne('Assessment', 'answers', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  @Index()
  assessment!: Assessment

  @Column({ name: 'assessment_id' })
  assessmentId!: string

  @ManyToOne('Question', 'answers', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'question_id' })
  @Index()
  question!: Question

  @Column({ name: 'question_id' })
  questionId!: string

  // @OneToMany(() => Strategy, (strategy) => strategy.answer) // On hold
  // strategies!: Strategy[]
}
