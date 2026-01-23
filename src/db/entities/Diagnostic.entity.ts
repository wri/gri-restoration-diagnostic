import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { Assessment } from './Assessment.entity';

@Entity('diagnostic')
@Index(['version', 'language'], { unique: true })
export class Diagnostic {
  @PrimaryColumn('varchar', { length: 36 })
  diagnostic_id!: string;

  @Column('text')
  questions!: string; // JSON stringified array

  @Column('varchar')
  version!: string;

  @Column('varchar', { length: 2 })
  language!: string;

  @CreateDateColumn()
  creation_date!: Date;

  @OneToMany(() => Assessment, assessment => assessment.diagnostic)
  assessments!: Assessment[];
}
