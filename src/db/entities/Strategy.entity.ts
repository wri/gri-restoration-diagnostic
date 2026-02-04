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
import { Answer } from './Answer.entity'
import { Lead } from './Lead.entity'

export enum StrategyScale {
  IMMEDIATE = 'immediate',
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
}

@Entity('strategy')
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  action!: string

  @Column({ type: 'enum', enum: StrategyScale })
  scale!: StrategyScale

  @Column({ type: 'date', nullable: true })
  deadline!: Date | null

  @Column({ type: 'varchar', nullable: true })
  responsibility!: string | null

  @Column({ name: 'sort_order', type: 'int' })
  sortOrder!: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @ManyToOne(() => Answer, (answer) => answer.strategies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answer_id' })
  @Index()
  answer!: Answer

  @Column({ name: 'answer_id' })
  answerId!: string

  @ManyToOne(() => Lead, (lead) => lead.strategies, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by' })
  @Index()
  createdBy!: Lead

  @Column({ name: 'created_by' })
  createdById!: string
}
