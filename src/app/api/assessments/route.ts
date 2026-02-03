import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/db/data-source';
import { Assessment, ProjectType } from '@/db/entities/Assessment.entity';
import { Lead } from '@/db/entities/Lead.entity';
import { Region } from '@/db/entities/Region.entity';
import { Diagnostic } from '@/db/entities/Diagnostic.entity';
import type { AssessmentSetupFormData } from '@/types/assessment-setup.types';
import { randomBytes } from 'crypto';

function generatePassword(): string {
  // Generate a 16-character password
  return randomBytes(12).toString('base64').slice(0, 16).replace(/[+/=]/g, '-');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentSetupFormData & { language: string } = await request.json();

    // Normalize and validate email server-side
    const normalizedEmail = normalizeEmail(body.email);
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Initialize database connection if not already
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Generate a secure password for this assessment
    const password = generatePassword();

    // Wrap all DB operations in a transaction to prevent orphan records
    const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
      const leadRepository = transactionalEntityManager.getRepository(Lead);
      const regionRepository = transactionalEntityManager.getRepository(Region);
      const assessmentRepository = transactionalEntityManager.getRepository(Assessment);
      const diagnosticRepository = transactionalEntityManager.getRepository(Diagnostic);

      // 1. Create or find Lead (user information)
      let lead = await leadRepository.findOne({ where: { email: normalizedEmail } });
      
      if (!lead) {
        lead = leadRepository.create({
          job_title: body.title,
          name: body.fullName,
          email: normalizedEmail,
          organization: body.organization,
          role: body.role,
        });
        lead = await leadRepository.save(lead);
      }

      // 2. Create Region (geography information)
      const region = regionRepository.create({
        region_name: `${body.country} - ${body.subRegion}`,
        geography_type: body.geographyType,
        countries: body.country,
        sub_region: body.subRegion,
        scope: body.scope,
        ecosystems: JSON.stringify(body.ecosystems),
        gis_url: body.gisLink || undefined,
      });
      const savedRegion = await regionRepository.save(region);

      // 3. Find the most recent diagnostic for the user's language
      const diagnostic = await diagnosticRepository.findOne({
        where: { language: body.language },
        order: { creation_date: 'DESC' }
      });

      if (!diagnostic) {
        throw new Error(`No diagnostic found for language: ${body.language}`);
      }

      // 4. Create Assessment (linking lead, region, and diagnostic)
      const currentYear = new Date().getFullYear().toString();
      
      const assessment = new Assessment();
      assessment.lead_id = lead.id;
      assessment.region_id = savedRegion.id;
      assessment.diagnostic_id = diagnostic.id;
      assessment.password = password;
      assessment.diagnostic_year = currentYear;
      assessment.project_type = ProjectType.OTHER;
      assessment.status = 'draft';

      const savedAssessment = await assessmentRepository.save(assessment);

      return {
        assessmentId: savedAssessment.id,
        password: password
      };
    });

    return NextResponse.json(
      { 
        success: true, 
        assessmentId: result.assessmentId,
        password: result.password,
        message: 'Assessment created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create assessment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create assessment' 
      },
      { status: 500 }
    );
  }
}

