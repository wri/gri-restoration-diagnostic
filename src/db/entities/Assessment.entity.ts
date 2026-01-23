import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Lead } from './Lead.entity';
import { Region } from './Region.entity';
import { Diagnostic } from './Diagnostic.entity';

export enum ProjectType {
  GEF_8 = 'GEF_8',
  WRI = 'WRI',
  OTHER = 'other'
}

@Entity('assessments')
export class Assessment {
  @PrimaryColumn('varchar', { length: 36 })
  assessment_id!: string;

  @Column('varchar', { length: 36 })
  @Index()
  diagnostic_id!: string;

  @Column('varchar', { nullable: true })
  assessment_name?: string;

  @Column('text')
  password_encrypted!: string;

  @CreateDateColumn()
  creation_date!: Date;

  @UpdateDateColumn({ nullable: true })
  last_update?: Date;

  @Column('timestamp', { nullable: true })
  submission_date?: Date;

  @Column('varchar', { length: 4 })
  diagnostic_year!: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.OTHER
  })
  project_type!: ProjectType;

  @Column('varchar', { length: 36 })
  @Index()
  lead_id!: string;

  @Column('varchar', { length: 36 })
  @Index()
  region_id!: string;

  @ManyToOne(() => Lead, lead => lead.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead!: Lead;

  @ManyToOne(() => Region, region => region.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'region_id' })
  region!: Region;

  @ManyToOne(() => Diagnostic, diagnostic => diagnostic.assessments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'diagnostic_id' })
  diagnostic!: Diagnostic;
}
