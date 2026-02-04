import { AppDataSource } from '../data-source';
import { Diagnostic } from '../entities/Diagnostic.entity';
import { Question, Theme } from '../entities/Question.entity';
import { Guidance } from '../entities/Guidance.entity';

/**
 * Seed Diagnostic v1.0.0 with 31 Questions
 * Source: Restoration_Diagnostic_Assessment_Tool.csv
 */
export async function seedDiagnosticWithQuestions() {
  console.log('📋 Seeding Diagnostic v1.0.0 with 31 questions...');

  const diagnosticRepo = AppDataSource.getRepository(Diagnostic);
  const questionRepo = AppDataSource.getRepository(Question);
  const guidanceRepo = AppDataSource.getRepository(Guidance);

  // Check if diagnostic already exists
  let diagnostic = await diagnosticRepo.findOne({
    where: { version: 'v1.0.0', language: 'en' }
  });

  if (diagnostic) {
    console.log('⚠️  Diagnostic v1.0.0 already exists, checking questions...');
  } else {
    // Create diagnostic
    diagnostic = diagnosticRepo.create({
      title: 'Restoration Diagnostic Assessment Tool',
      description: 'Comprehensive assessment tool for evaluating restoration readiness across motivate, enable, and implement dimensions',
      version: 'v1.0.0',
      language: 'en'
    });
    await diagnosticRepo.save(diagnostic);
    console.log('✅ Diagnostic v1.0.0 created');
  }

  // Check if questions already exist
  const existingQuestions = await questionRepo.count({
    where: { diagnosticId: diagnostic.id }
  });

  if (existingQuestions > 0) {
    console.log(`⚠️  ${existingQuestions} questions already exist, skipping seed`);
    return;
  }

  // Seed questions (31 total: 8 Motivate, 13 Enable, 10 Implement)
  const questions = [
    // MOTIVATE Theme (8 questions)
    {
      questionCode: 'M1',
      theme: Theme.MOTIVATE,
      feature: 'a. Benefits',
      keySuccessFactor: 'Benefits are understood and valued',
      definition: 'Stakeholders recognize and value the social, economic, and environmental benefits of restoration',
      questionText: 'Do stakeholders understand and value the benefits of restoration?',
      comments: 'Consider economic benefits (jobs, income), ecological benefits (biodiversity, water quality), and social benefits (community well-being)',
      followUpQuestions: JSON.stringify(['What benefits are most valued?', 'Who benefits most from restoration?']),
      strategyExamples: 'Conduct benefit-cost analysis, develop communication materials highlighting benefits, organize site visits',
      sortOrder: 1
    },
    {
      questionCode: 'M2',
      theme: Theme.MOTIVATE,
      feature: 'a. Benefits',
      keySuccessFactor: 'Economic case is compelling',
      definition: 'The economic rationale for restoration is clear and financially viable',
      questionText: 'Is there a compelling economic case for restoration?',
      comments: 'Economic viability includes job creation, sustainable livelihoods, and long-term financial returns',
      followUpQuestions: JSON.stringify(['What are the projected economic returns?', 'How long until financial break-even?']),
      strategyExamples: 'Develop business plans, identify revenue streams, calculate ROI, engage economists',
      sortOrder: 2
    },
    {
      questionCode: 'M3',
      theme: Theme.MOTIVATE,
      feature: 'b. Awareness',
      keySuccessFactor: 'Public awareness is high',
      definition: 'General public and key stakeholders are aware of degradation and restoration needs',
      questionText: 'Is there high public awareness about environmental degradation and restoration needs?',
      comments: 'Awareness should span local communities, government officials, and private sector',
      followUpQuestions: JSON.stringify(['Which groups are most/least aware?', 'What channels reach target audiences?']),
      strategyExamples: 'Launch awareness campaigns, leverage media partnerships, organize community events',
      sortOrder: 3
    },
    {
      questionCode: 'M4',
      theme: Theme.MOTIVATE,
      feature: 'b. Awareness',
      keySuccessFactor: 'Champions and leaders exist',
      definition: 'Visible champions advocate for restoration across sectors',
      questionText: 'Are there visible champions and leaders advocating for restoration?',
      comments: 'Champions can be government officials, community leaders, celebrities, or private sector leaders',
      followUpQuestions: JSON.stringify(['Who are the current champions?', 'What sectors lack champions?']),
      strategyExamples: 'Identify and empower champions, create champion networks, provide platforms for advocacy',
      sortOrder: 4
    },
    {
      questionCode: 'M5',
      theme: Theme.MOTIVATE,
      feature: 'c. Crisis events',
      keySuccessFactor: 'Crisis creates urgency',
      definition: 'Recent environmental crises have created political and social momentum',
      questionText: 'Have recent crisis events (drought, flood, fire) created urgency for restoration?',
      comments: 'Crises can be natural disasters, health emergencies, or economic shocks linked to degradation',
      followUpQuestions: JSON.stringify(['What was the impact of recent crises?', 'Is the urgency sustainable?']),
      strategyExamples: 'Document crisis impacts, link restoration to crisis prevention, maintain urgency through storytelling',
      sortOrder: 5
    },
    {
      questionCode: 'M6',
      theme: Theme.MOTIVATE,
      feature: 'c. Crisis events',
      keySuccessFactor: 'Crisis response includes restoration',
      definition: 'Government and society response to crises includes restoration solutions',
      questionText: 'Do crisis response plans include restoration as a solution?',
      comments: 'Response plans should integrate nature-based solutions and restoration approaches',
      followUpQuestions: JSON.stringify(['Which crisis plans mention restoration?', 'How is restoration prioritized?']),
      strategyExamples: 'Integrate restoration into disaster response frameworks, train emergency planners on NbS',
      sortOrder: 6
    },
    {
      questionCode: 'M7',
      theme: Theme.MOTIVATE,
      feature: 'd. Legal requirements',
      keySuccessFactor: 'Legal mandates exist',
      definition: 'Laws and regulations require or incentivize restoration',
      questionText: 'Are there legal requirements or mandates for restoration?',
      comments: 'Include national laws, international commitments, corporate regulations, and enforcement mechanisms',
      followUpQuestions: JSON.stringify(['What laws exist?', 'Are they enforced?', 'What are penalties for non-compliance?']),
      strategyExamples: 'Strengthen legal frameworks, improve enforcement, create restoration mandates',
      sortOrder: 7
    },
    {
      questionCode: 'M8',
      theme: Theme.MOTIVATE,
      feature: 'd. Legal requirements',
      keySuccessFactor: 'Incentives align with restoration',
      definition: 'Policy incentives and subsidies support rather than undermine restoration',
      questionText: 'Do policy incentives and subsidies support restoration (vs. degradation)?',
      comments: 'Identify harmful subsidies (e.g., for deforestation) vs. beneficial ones (e.g., PES programs)',
      followUpQuestions: JSON.stringify(['What harmful subsidies exist?', 'What restoration incentives are available?']),
      strategyExamples: 'Reform harmful subsidies, create restoration incentives, implement PES schemes',
      sortOrder: 8
    },

    // ENABLE Theme (13 questions)
    {
      questionCode: 'E1',
      theme: Theme.ENABLE,
      feature: 'a. Ecological conditions',
      keySuccessFactor: 'Degradation is reversible',
      definition: 'Ecosystem degradation has not crossed irreversible tipping points',
      questionText: 'Is the degradation reversible (not past tipping points)?',
      comments: 'Assess soil health, water availability, seed banks, and ecosystem resilience',
      followUpQuestions: JSON.stringify(['What is the degradation severity?', 'Are there intact reference ecosystems nearby?']),
      strategyExamples: 'Conduct ecological assessments, consult experts, test pilot restoration sites',
      sortOrder: 1
    },
    {
      questionCode: 'E2',
      theme: Theme.ENABLE,
      feature: 'a. Ecological conditions',
      keySuccessFactor: 'Propagules and species available',
      definition: 'Native seeds, seedlings, and propagules are accessible for restoration',
      questionText: 'Are native seeds, seedlings, and propagules available for restoration?',
      comments: 'Availability includes wild collection, nurseries, seed banks, and natural regeneration',
      followUpQuestions: JSON.stringify(['What species are available?', 'What are supply gaps?', 'Are nurseries operational?']),
      strategyExamples: 'Establish nurseries, create seed banks, train collectors, map seed sources',
      sortOrder: 2
    },
    {
      questionCode: 'E3',
      theme: Theme.ENABLE,
      feature: 'a. Ecological conditions',
      keySuccessFactor: 'Threats are manageable',
      definition: 'Ongoing threats to restoration success can be managed or removed',
      questionText: 'Can ongoing threats (fire, grazing, invasives) be managed?',
      comments: 'Identify and assess controllability of major threats including fire, overgrazing, invasive species, pollution',
      followUpQuestions: JSON.stringify(['What are the main threats?', 'Who manages these threats?', 'What resources are needed?']),
      strategyExamples: 'Develop threat management plans, create firebreaks, control invasives, establish protected zones',
      sortOrder: 3
    },
    {
      questionCode: 'E4',
      theme: Theme.ENABLE,
      feature: 'b. Market conditions',
      keySuccessFactor: 'Market demand for products',
      definition: 'Markets exist for products from restored lands',
      questionText: 'Is there market demand for restoration products (timber, fruit, carbon)?',
      comments: 'Products can include timber, NTFPs, carbon credits, ecosystem services payments',
      followUpQuestions: JSON.stringify(['What products have market potential?', 'What are current prices?', 'Who are the buyers?']),
      strategyExamples: 'Conduct market analysis, develop value chains, connect producers to buyers, certify products',
      sortOrder: 4
    },
    {
      questionCode: 'E5',
      theme: Theme.ENABLE,
      feature: 'b. Market conditions',
      keySuccessFactor: 'Value chains are functional',
      definition: 'Infrastructure and systems exist to get products to market',
      questionText: 'Are value chains and market infrastructure functional for restoration products?',
      comments: 'Infrastructure includes processing facilities, storage, transportation, and market access',
      followUpQuestions: JSON.stringify(['What infrastructure exists?', 'What are the gaps?', 'Who controls market access?']),
      strategyExamples: 'Invest in processing facilities, improve transportation, formalize producer organizations',
      sortOrder: 5
    },
    {
      questionCode: 'E6',
      theme: Theme.ENABLE,
      feature: 'c. Policy conditions',
      keySuccessFactor: 'Supportive policies exist',
      definition: 'National and local policies actively support restoration',
      questionText: 'Are there supportive national and local policies for restoration?',
      comments: 'Policies should address land tenure, resource rights, financing mechanisms, and technical support',
      followUpQuestions: JSON.stringify(['What policies exist?', 'Are they implemented?', 'What policy gaps exist?']),
      strategyExamples: 'Advocate for policy reform, support policy implementation, document best practices',
      sortOrder: 6
    },
    {
      questionCode: 'E7',
      theme: Theme.ENABLE,
      feature: 'c. Policy conditions',
      keySuccessFactor: 'Land tenure is secure',
      definition: 'Land rights and tenure are clear and secure for restoration practitioners',
      questionText: 'Are land tenure and resource rights clear and secure?',
      comments: 'Secure tenure is essential for long-term restoration investment and sustainability',
      followUpQuestions: JSON.stringify(['Who holds land rights?', 'Are there tenure conflicts?', 'How long are tenure agreements?']),
      strategyExamples: 'Clarify land rights, resolve conflicts, issue long-term leases, recognize customary rights',
      sortOrder: 7
    },
    {
      questionCode: 'E8',
      theme: Theme.ENABLE,
      feature: 'd. Social conditions',
      keySuccessFactor: 'Community support exists',
      definition: 'Local communities support and participate in restoration',
      questionText: 'Do local communities support restoration efforts?',
      comments: 'Support includes active participation, buy-in from leaders, and alignment with livelihoods',
      followUpQuestions: JSON.stringify(['What is the level of participation?', 'Are there opposing groups?', 'What motivates communities?']),
      strategyExamples: 'Conduct participatory planning, ensure benefit-sharing, respect local knowledge, build trust',
      sortOrder: 8
    },
    {
      questionCode: 'E9',
      theme: Theme.ENABLE,
      feature: 'd. Social conditions',
      keySuccessFactor: 'Gender equity is prioritized',
      definition: 'Women have equal voice, participation, and benefits in restoration',
      questionText: 'Are women equally involved and benefiting from restoration?',
      comments: 'Gender equity includes decision-making, labor distribution, benefit access, and capacity building',
      followUpQuestions: JSON.stringify(['What percentage of participants are women?', 'Do women hold leadership roles?', 'Are benefits equitable?']),
      strategyExamples: 'Set gender quotas, provide training for women, ensure equal pay, create women-led groups',
      sortOrder: 9
    },
    {
      questionCode: 'E10',
      theme: Theme.ENABLE,
      feature: 'd. Social conditions',
      keySuccessFactor: 'Indigenous rights respected',
      definition: 'Indigenous peoples\' rights, knowledge, and governance are respected',
      questionText: 'Are indigenous peoples\' rights and traditional knowledge respected?',
      comments: 'Respect includes FPIC, benefit-sharing, traditional governance, and cultural practices',
      followUpQuestions: JSON.stringify(['Are indigenous communities consulted?', 'Is FPIC obtained?', 'How is traditional knowledge integrated?']),
      strategyExamples: 'Implement FPIC processes, co-design with indigenous communities, recognize customary governance',
      sortOrder: 10
    },
    {
      questionCode: 'E11',
      theme: Theme.ENABLE,
      feature: 'e. Institutional conditions',
      keySuccessFactor: 'Capable institutions exist',
      definition: 'Government and civil society institutions have capacity to support restoration',
      questionText: 'Do institutions have the capacity to support restoration at scale?',
      comments: 'Capacity includes technical expertise, administrative systems, coordination mechanisms',
      followUpQuestions: JSON.stringify(['Which institutions are involved?', 'What capacity gaps exist?', 'Is coordination effective?']),
      strategyExamples: 'Strengthen institutions, build capacity, improve coordination, clarify mandates',
      sortOrder: 11
    },
    {
      questionCode: 'E12',
      theme: Theme.ENABLE,
      feature: 'e. Institutional conditions',
      keySuccessFactor: 'Multi-stakeholder platforms exist',
      definition: 'Platforms for cross-sector dialogue and coordination are active',
      questionText: 'Are there functional multi-stakeholder platforms for restoration?',
      comments: 'Platforms should include government, civil society, private sector, communities, and researchers',
      followUpQuestions: JSON.stringify(['Who participates in platforms?', 'How often do they meet?', 'What decisions are made?']),
      strategyExamples: 'Establish platforms, define governance, ensure inclusive participation, track outcomes',
      sortOrder: 12
    },
    {
      questionCode: 'E13',
      theme: Theme.ENABLE,
      feature: 'e. Institutional conditions',
      keySuccessFactor: 'Corruption is low',
      definition: 'Corruption does not significantly undermine restoration efforts and funding',
      questionText: 'Is corruption low enough that it doesn\'t undermine restoration?',
      comments: 'Corruption can divert funds, create unfair access, and erode trust in restoration programs',
      followUpQuestions: JSON.stringify(['What are corruption risks?', 'Are there accountability mechanisms?', 'Is transparency adequate?']),
      strategyExamples: 'Strengthen transparency, implement accountability systems, engage independent monitors',
      sortOrder: 13
    },

    // IMPLEMENT Theme (10 questions)
    {
      questionCode: 'I1',
      theme: Theme.IMPLEMENT,
      feature: 'a. Leadership',
      keySuccessFactor: 'Government leadership exists',
      definition: 'Government demonstrates strong leadership and commitment to restoration',
      questionText: 'Is there strong government leadership committed to restoration?',
      comments: 'Leadership includes political will, institutional mandates, and resource allocation',
      followUpQuestions: JSON.stringify(['Which agencies lead?', 'Is leadership consistent over time?', 'Are budgets allocated?']),
      strategyExamples: 'Engage high-level officials, demonstrate quick wins, align with political priorities',
      sortOrder: 1
    },
    {
      questionCode: 'I2',
      theme: Theme.IMPLEMENT,
      feature: 'a. Leadership',
      keySuccessFactor: 'Private sector engaged',
      definition: 'Private companies actively invest in and support restoration',
      questionText: 'Is the private sector actively engaged in restoration?',
      comments: 'Engagement can be through CSR, supply chain requirements, or business opportunities',
      followUpQuestions: JSON.stringify(['Which companies are involved?', 'What motivates their engagement?', 'How much do they invest?']),
      strategyExamples: 'Build business case, create partnerships, showcase ROI, leverage supply chains',
      sortOrder: 2
    },
    {
      questionCode: 'I3',
      theme: Theme.IMPLEMENT,
      feature: 'b. Knowledge',
      keySuccessFactor: 'Technical knowledge available',
      definition: 'Sufficient technical knowledge and expertise exists for restoration',
      questionText: 'Is technical knowledge and expertise available for restoration?',
      comments: 'Knowledge includes ecology, agronomy, hydrology, social science, and restoration techniques',
      followUpQuestions: JSON.stringify(['What knowledge gaps exist?', 'Who are the experts?', 'Is knowledge accessible?']),
      strategyExamples: 'Conduct research, document best practices, train practitioners, establish knowledge networks',
      sortOrder: 3
    },
    {
      questionCode: 'I4',
      theme: Theme.IMPLEMENT,
      feature: 'b. Knowledge',
      keySuccessFactor: 'Knowledge is shared',
      definition: 'Knowledge and best practices are actively shared across practitioners',
      questionText: 'Is knowledge effectively shared among restoration practitioners?',
      comments: 'Sharing mechanisms include training programs, peer networks, publications, and digital platforms',
      followUpQuestions: JSON.stringify(['What sharing mechanisms exist?', 'Who has access?', 'Is knowledge in local languages?']),
      strategyExamples: 'Create knowledge platforms, organize exchange visits, publish in local languages, use digital tools',
      sortOrder: 4
    },
    {
      questionCode: 'I5',
      theme: Theme.IMPLEMENT,
      feature: 'c. Technical design',
      keySuccessFactor: 'Restoration plans are science-based',
      definition: 'Restoration designs are based on ecological science and local context',
      questionText: 'Are restoration plans based on sound ecological science?',
      comments: 'Plans should consider site conditions, native species, ecosystem functions, and climate change',
      followUpQuestions: JSON.stringify(['Who designs restoration plans?', 'What data informs design?', 'Are plans peer-reviewed?']),
      strategyExamples: 'Engage scientists, conduct baseline assessments, use reference ecosystems, pilot test approaches',
      sortOrder: 5
    },
    {
      questionCode: 'I6',
      theme: Theme.IMPLEMENT,
      feature: 'c. Technical design',
      keySuccessFactor: 'Plans integrate social needs',
      definition: 'Restoration plans integrate community livelihoods and social objectives',
      questionText: 'Do restoration plans integrate community livelihoods and social needs?',
      comments: 'Integration ensures restoration supports food security, income, and cultural values',
      followUpQuestions: JSON.stringify(['How are communities involved in planning?', 'What livelihood benefits are designed in?', 'Are cultural sites protected?']),
      strategyExamples: 'Use participatory design, integrate agroforestry, protect sacred sites, ensure benefit flows',
      sortOrder: 6
    },
    {
      questionCode: 'I7',
      theme: Theme.IMPLEMENT,
      feature: 'd. Finance and incentives',
      keySuccessFactor: 'Adequate funding available',
      definition: 'Sufficient finance is available for restoration at the required scale',
      questionText: 'Is adequate funding available for restoration at scale?',
      comments: 'Funding sources include public budgets, private investment, international donors, carbon markets',
      followUpQuestions: JSON.stringify(['What funding exists?', 'What is the funding gap?', 'Is funding long-term?']),
      strategyExamples: 'Mobilize domestic resources, attract private capital, access climate finance, create blended finance',
      sortOrder: 7
    },
    {
      questionCode: 'I8',
      theme: Theme.IMPLEMENT,
      feature: 'd. Finance and incentives',
      keySuccessFactor: 'Incentives for landholders exist',
      definition: 'Economic incentives motivate landholders to restore and maintain ecosystems',
      questionText: 'Are there effective incentives for landholders to restore?',
      comments: 'Incentives can be payments (PES), subsidies, tax breaks, market access, or certification',
      followUpQuestions: JSON.stringify(['What incentives exist?', 'Are they attractive?', 'How many landholders participate?']),
      strategyExamples: 'Design PES programs, offer subsidies, create certification schemes, improve market access',
      sortOrder: 8
    },
    {
      questionCode: 'I9',
      theme: Theme.IMPLEMENT,
      feature: 'e. Feedback',
      keySuccessFactor: 'Monitoring systems exist',
      definition: 'Systems are in place to monitor restoration progress and outcomes',
      questionText: 'Are monitoring systems in place to track restoration progress?',
      comments: 'Monitoring should cover ecological, social, and economic indicators',
      followUpQuestions: JSON.stringify(['What indicators are monitored?', 'How often?', 'Who does the monitoring?', 'Is data publicly available?']),
      strategyExamples: 'Establish monitoring protocols, train monitors, use digital tools, ensure transparency',
      sortOrder: 9
    },
    {
      questionCode: 'I10',
      theme: Theme.IMPLEMENT,
      feature: 'e. Feedback',
      keySuccessFactor: 'Adaptive management used',
      definition: 'Monitoring data informs adaptive management and course corrections',
      questionText: 'Is monitoring data used for adaptive management?',
      comments: 'Adaptive management means adjusting strategies based on results and learning',
      followUpQuestions: JSON.stringify(['How is data used in decision-making?', 'What adjustments have been made?', 'Who decides on changes?']),
      strategyExamples: 'Institutionalize learning loops, conduct regular reviews, empower managers to adapt, document lessons',
      sortOrder: 10
    }
  ];

  // Insert questions
  for (const q of questions) {
    const question = questionRepo.create({
      ...q,
      diagnosticId: diagnostic.id
    });
    await questionRepo.save(question);
  }

  console.log(`✅ Created ${questions.length} questions`);

  // Optional: Add sample guidance for a few questions
  const sampleGuidance = [
    {
      questionCode: 'M1',
      sections: [
        {
          title: 'Why benefits matter',
          content: '<p>Understanding benefits is the foundation of stakeholder buy-in. When people see clear personal and community benefits, they are more likely to support restoration.</p><ul><li>Economic: jobs, income, products</li><li>Ecological: clean water, biodiversity, climate regulation</li><li>Social: recreation, cultural values, health</li></ul>',
          sortOrder: 1
        },
        {
          title: 'How to assess benefits',
          content: '<p>Use participatory methods to identify benefits valued by different stakeholder groups:</p><ol><li>Conduct focus groups with diverse stakeholders</li><li>Document current ecosystem services</li><li>Model future benefits scenarios</li><li>Quantify benefits where possible</li></ol>',
          sortOrder: 2
        }
      ]
    },
    {
      questionCode: 'E1',
      sections: [
        {
          title: 'Assessing reversibility',
          content: '<p>Not all degradation can be reversed. Key factors to assess:</p><ul><li><strong>Soil condition:</strong> Has topsoil been completely lost?</li><li><strong>Hydrology:</strong> Can water regimes be restored?</li><li><strong>Seed sources:</strong> Are there nearby intact ecosystems?</li><li><strong>Climate:</strong> Is the climate still suitable?</li></ul>',
          sortOrder: 1
        }
      ]
    }
  ];

  let guidanceCount = 0;
  for (const guide of sampleGuidance) {
    const question = await questionRepo.findOne({
      where: { diagnosticId: diagnostic.id, questionCode: guide.questionCode }
    });

    if (question) {
      for (const section of guide.sections) {
        const guidance = guidanceRepo.create({
          questionId: question.id,
          title: section.title,
          content: section.content,
          sortOrder: section.sortOrder
        });
        await guidanceRepo.save(guidance);
        guidanceCount++;
      }
    }
  }

  console.log(`✅ Created ${guidanceCount} guidance sections`);
  console.log('✅ Diagnostic seed complete');
}
