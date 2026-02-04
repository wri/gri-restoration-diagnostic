import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm'
import { Diagnostic } from './Diagnostic.entity'
import { Answer } from './Answer.entity'
import { Guidance } from './Guidance.entity'
import { CustomTopic } from './CustomTopic.entity'

export enum Theme {
  MOTIVATE = 'Motivate',
  ENABLE = 'Enable',
  IMPLEMENT = 'Implement',
}

@Entity('question')
@Unique(['diagnostic', 'questionCode'])
@Index(['theme'])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'question_code', type: 'varchar' })
  questionCode!: string

  @Column({ type: 'enum', enum: Theme })
  theme!: Theme

  @Column({ type: 'varchar' })
  feature!: string

  @Column({ name: 'key_success_factor', type: 'varchar' })
  keySuccessFactor!: string

  @Column({ type: 'text', nullable: true })
  definition!: string | null

  @Column({ name: 'question_text', type: 'text' })
  questionText!: string

  @Column({ type: 'text', nullable: true })
  comments!: string | null

  @Column({ name: 'follow_up_questions', type: 'text', nullable: true })
  followUpQuestions!: string | null

  @Column({ name: 'strategy_examples', type: 'text', nullable: true })
  strategyExamples!: string | null

  @Column({ name: 'sort_order', type: 'int' })
  sortOrder!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @ManyToOne(() => Diagnostic, (diagnostic) => diagnostic.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'diagnostic_id' })
  @Index()
  diagnostic!: Diagnostic

  @Column({ name: 'diagnostic_id' })
  diagnosticId!: string

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[]

  @OneToMany(() => Guidance, (guidance) => guidance.question)
  guidance!: Guidance[]

  @OneToMany(() => CustomTopic, (customTopic) => customTopic.question)
  customTopics!: CustomTopic[]
}
