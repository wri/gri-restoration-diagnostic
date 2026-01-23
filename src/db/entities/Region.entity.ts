import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Assessment } from './Assessment.entity';

@Entity('region')
export class Region {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar')
  region_name!: string;

  @Column('varchar')
  geography_type!: string;

  @Column('text', { nullable: true })
  countries?: string;

  @Column('varchar', { nullable: true })
  sub_region?: string;

  @Column('text')
  ecosystems!: string; // JSON stringified array

  @Column('text', { nullable: true })
  gis_url?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Assessment, assessment => assessment.region)
  assessments!: Assessment[];
}
