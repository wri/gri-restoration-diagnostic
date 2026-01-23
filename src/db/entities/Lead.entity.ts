import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Assessment } from './Assessment.entity';

@Entity('lead')
export class Lead {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { nullable: true })
  job_title?: string;

  @Column('varchar')
  name!: string;

  @Column('varchar', { unique: true })
  email!: string;

  @Column('varchar', { nullable: true })
  organization?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Assessment, assessment => assessment.lead)
  assessments!: Assessment[];
}
