import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { Assessment } from './Assessment.entity'
import { Question } from './Question.entity'
import { Lead } from './Lead.entity'

@Entity('custom_topic')
export class CustomTopic {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'topic_text', type: 'text' })
  topicText!: string

  @Column({ name: 'sort_order', type: 'int' })
  sortOrder!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne(() => Assessment, (assessment) => assessment.customTopics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assessment_id' })
  @Index()
  assessment!: Assessment

  @Column({ name: 'assessment_id' })
  assessmentId!: string

  @ManyToOne(() => Question, (question) => question.customTopics, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'question_id' })
  @Index()
  question!: Question

  @Column({ name: 'question_id' })
  questionId!: string

  @ManyToOne(() => Lead, (lead) => lead.customTopics, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by' })
  @Index()
  createdBy!: Lead

  @Column({ name: 'created_by' })
  createdById!: string
}
