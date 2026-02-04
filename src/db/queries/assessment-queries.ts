import { AppDataSource } from '../data-source'
import { Question, Theme } from '../entities/Question.entity'
import { Answer, AnswerValue } from '../entities/Answer.entity'
import { Assessment } from '../entities/Assessment.entity'
import { Guidance } from '../entities/Guidance.entity'
import { CustomTopic } from '../entities/CustomTopic.entity'
import { Strategy, StrategyScale } from '../entities/Strategy.entity'
import { Contributor } from '../entities/Contributor.entity'
import { Lead } from '../entities/Lead.entity'

/**
 * Fetch all questions for a diagnostic, grouped by theme
 */
export async function getQuestionsByDiagnostic(diagnosticId: string) {
  const questionRepo = AppDataSource.getRepository(Question)
  
  const questions = await questionRepo.find({
    where: { diagnosticId },
    order: {
      theme: 'ASC',
      sortOrder: 'ASC'
    }
  })

  // Group by theme
  const grouped = {
    [Theme.MOTIVATE]: questions.filter(q => q.theme === Theme.MOTIVATE),
    [Theme.ENABLE]: questions.filter(q => q.theme === Theme.ENABLE),
    [Theme.IMPLEMENT]: questions.filter(q => q.theme === Theme.IMPLEMENT),
  }

  return grouped
}

/**
 * Fetch questions with their answers for an assessment
 * Optimized single query with LEFT JOIN
 */
export async function getQuestionsWithAnswers(assessmentId: string) {
  const assessmentRepo = AppDataSource.getRepository(Assessment)
  
  const assessment = await assessmentRepo.findOne({
    where: { id: assessmentId },
    relations: ['diagnostic']
  })

  if (!assessment) {
    throw new Error('Assessment not found')
  }

  const questionRepo = AppDataSource.getRepository(Question)
  
  // Single optimized query with LEFT JOIN to get questions and their answers
  const questionsWithAnswers = await questionRepo
    .createQueryBuilder('question')
    .leftJoinAndMapOne(
      'question.answer',
      Answer,
      'answer',
      'answer.question_id = question.id AND answer.assessment_id = :assessmentId',
      { assessmentId }
    )
    .where('question.diagnostic_id = :diagnosticId', { diagnosticId: assessment.diagnosticId })
    .orderBy('question.theme', 'ASC')
    .addOrderBy('question.sort_order', 'ASC')
    .getMany()

  return questionsWithAnswers
}

/**
 * Fetch summary of answers by theme for an assessment
 * Returns count of yes/partly/no/unanswered per theme
 */
export async function getAnswerSummary(assessmentId: string) {
  const answerRepo = AppDataSource.getRepository(Answer)
  
  const summary = await answerRepo
    .createQueryBuilder('answer')
    .innerJoin('answer.question', 'question')
    .select('question.theme', 'theme')
    .addSelect('answer.value', 'value')
    .addSelect('COUNT(*)', 'count')
    .where('answer.assessment_id = :assessmentId', { assessmentId })
    .groupBy('question.theme')
    .addGroupBy('answer.value')
    .getRawMany()

  // Get total questions per theme for unanswered count
  const questionRepo = AppDataSource.getRepository(Question)
  const assessmentRepo = AppDataSource.getRepository(Assessment)
  
  const assessment = await assessmentRepo.findOne({
    where: { id: assessmentId },
    select: ['diagnosticId']
  })

  if (!assessment) {
    throw new Error('Assessment not found')
  }

  const totalByTheme = await questionRepo
    .createQueryBuilder('question')
    .select('question.theme', 'theme')
    .addSelect('COUNT(*)', 'total')
    .where('question.diagnostic_id = :diagnosticId', { diagnosticId: assessment.diagnosticId })
    .groupBy('question.theme')
    .getRawMany()

  // Format the result
  const result: Record<Theme, {
    yes: number
    partly: number
    no: number
    unanswered: number
    total: number
  }> = {
    [Theme.MOTIVATE]: { yes: 0, partly: 0, no: 0, unanswered: 0, total: 0 },
    [Theme.ENABLE]: { yes: 0, partly: 0, no: 0, unanswered: 0, total: 0 },
    [Theme.IMPLEMENT]: { yes: 0, partly: 0, no: 0, unanswered: 0, total: 0 },
  }

  // Set totals
  for (const row of totalByTheme) {
    const theme = row.theme as Theme
    result[theme].total = parseInt(row.total, 10)
    result[theme].unanswered = parseInt(row.total, 10)
  }

  // Set answer counts
  for (const row of summary) {
    const theme = row.theme as Theme
    const value = row.value as AnswerValue | null
    const count = parseInt(row.count, 10)

    if (value === AnswerValue.YES) {
      result[theme].yes = count
    } else if (value === AnswerValue.PARTLY) {
      result[theme].partly = count
    } else if (value === AnswerValue.NO) {
      result[theme].no = count
    }
    
    // Reduce unanswered count
    if (value !== null) {
      result[theme].unanswered -= count
    }
  }

  return result
}

/**
 * Save or update an answer
 */
export async function saveAnswer(
  assessmentId: string,
  questionId: string,
  value: AnswerValue | null,
  notes?: string
) {
  const answerRepo = AppDataSource.getRepository(Answer)

  // Try to find existing answer
  let answer = await answerRepo.findOne({
    where: {
      assessmentId,
      questionId
    }
  })

  if (answer) {
    // Update existing
    answer.value = value
    if (notes !== undefined) {
      answer.notes = notes
    }
  } else {
    // Create new
    answer = answerRepo.create({
      assessmentId,
      questionId,
      value,
      notes: notes || null
    })
  }

  await answerRepo.save(answer)
  return answer
}

/**
 * Bulk save answers (for import or batch operations)
 */
export async function bulkSaveAnswers(
  assessmentId: string,
  answers: Array<{
    questionId: string
    value: AnswerValue | null
    notes?: string
  }>
) {
  const answerRepo = AppDataSource.getRepository(Answer)

  // Use upsert for efficiency
  const entities = answers.map(a => ({
    assessmentId,
    questionId: a.questionId,
    value: a.value,
    notes: a.notes || null
  }))

  await answerRepo.upsert(entities, ['assessmentId', 'questionId'])

  return entities.length
}

/**
 * Get a single question with full details including guidance
 */
export async function getQuestionById(questionId: string) {
  const questionRepo = AppDataSource.getRepository(Question)
  
  return questionRepo.findOne({
    where: { id: questionId },
    relations: ['guidance']
  })
}

/**
 * Get questions by theme for a diagnostic
 */
export async function getQuestionsByTheme(diagnosticId: string, theme: Theme) {
  const questionRepo = AppDataSource.getRepository(Question)
  
  return questionRepo.find({
    where: { diagnosticId, theme },
    order: { sortOrder: 'ASC' }
  })
}

/**
 * Get guidance sections for a question
 */
export async function getGuidanceForQuestion(questionId: string) {
  const guidanceRepo = AppDataSource.getRepository(Guidance)
  
  return guidanceRepo.find({
    where: { questionId },
    order: { sortOrder: 'ASC' }
  })
}

/**
 * Get custom topics for a question in an assessment
 */
export async function getCustomTopicsForQuestion(
  assessmentId: string,
  questionId: string
) {
  const customTopicRepo = AppDataSource.getRepository(CustomTopic)
  
  return customTopicRepo.find({
    where: { assessmentId, questionId },
    order: { sortOrder: 'ASC' },
    relations: ['createdBy']
  })
}

/**
 * Add a custom topic to a question
 */
export async function addCustomTopic(
  assessmentId: string,
  questionId: string,
  topicText: string,
  createdById: string
) {
  const customTopicRepo = AppDataSource.getRepository(CustomTopic)
  
  // Get next sort order
  const existingTopics = await customTopicRepo.find({
    where: { assessmentId, questionId },
    order: { sortOrder: 'DESC' },
    take: 1
  })
  
  const sortOrder = existingTopics.length > 0 ? existingTopics[0].sortOrder + 1 : 1

  const customTopic = customTopicRepo.create({
    assessmentId,
    questionId,
    topicText,
    createdById,
    sortOrder
  })

  await customTopicRepo.save(customTopic)
  return customTopic
}

/**
 * Delete a custom topic
 */
export async function deleteCustomTopic(customTopicId: string) {
  const customTopicRepo = AppDataSource.getRepository(CustomTopic)
  await customTopicRepo.delete(customTopicId)
}

/**
 * Get strategies for an answer
 */
export async function getStrategiesForAnswer(answerId: string) {
  const strategyRepo = AppDataSource.getRepository(Strategy)
  
  return strategyRepo.find({
    where: { answerId },
    order: { sortOrder: 'ASC' },
    relations: ['createdBy']
  })
}

/**
 * Add a strategy to an answer
 */
export async function addStrategy(
  answerId: string,
  action: string,
  scale: StrategyScale,
  createdById: string,
  deadline?: Date,
  responsibility?: string
) {
  const strategyRepo = AppDataSource.getRepository(Strategy)
  
  // Get next sort order
  const existingStrategies = await strategyRepo.find({
    where: { answerId },
    order: { sortOrder: 'DESC' },
    take: 1
  })
  
  const sortOrder = existingStrategies.length > 0 ? existingStrategies[0].sortOrder + 1 : 1

  const strategy = strategyRepo.create({
    answerId,
    action,
    scale,
    deadline: deadline || null,
    responsibility: responsibility || null,
    createdById,
    sortOrder
  })

  await strategyRepo.save(strategy)
  return strategy
}

/**
 * Update a strategy
 */
export async function updateStrategy(
  strategyId: string,
  updates: {
    action?: string
    scale?: StrategyScale
    deadline?: Date | null
    responsibility?: string | null
  }
) {
  const strategyRepo = AppDataSource.getRepository(Strategy)
  
  await strategyRepo.update(strategyId, updates)
  
  return strategyRepo.findOne({ where: { id: strategyId } })
}

/**
 * Delete a strategy
 */
export async function deleteStrategy(strategyId: string) {
  const strategyRepo = AppDataSource.getRepository(Strategy)
  await strategyRepo.delete(strategyId)
}

/**
 * Get contributors for an assessment
 */
export async function getAssessmentContributors(assessmentId: string) {
  const contributorRepo = AppDataSource.getRepository(Contributor)
  
  return contributorRepo.find({
    where: { assessmentId },
    relations: ['lead'],
    order: { addedAt: 'ASC' }
  })
}

/**
 * Add a contributor to an assessment
 */
export async function addContributor(
  assessmentId: string,
  leadId: string,
  contributorName: string,
  role?: string
) {
  const contributorRepo = AppDataSource.getRepository(Contributor)
  
  // Check if already exists
  const existing = await contributorRepo.findOne({
    where: { assessmentId, leadId }
  })
  
  if (existing) {
    return existing
  }

  const contributor = contributorRepo.create({
    assessmentId,
    leadId,
    contributorName,
    role: role || null
  })

  await contributorRepo.save(contributor)
  return contributor
}

/**
 * Remove a contributor from an assessment
 */
export async function removeContributor(assessmentId: string, leadId: string) {
  const contributorRepo = AppDataSource.getRepository(Contributor)
  
  await contributorRepo.delete({ assessmentId, leadId })
}

/**
 * Search for leads by email or name (for adding contributors)
 */
export async function searchLeads(query: string) {
  const leadRepo = AppDataSource.getRepository(Lead)
  
  return leadRepo
    .createQueryBuilder('lead')
    .where('LOWER(lead.email) LIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(lead.name) LIKE LOWER(:query)', { query: `%${query}%` })
    .take(10)
    .getMany()
}

/**
 * Get complete question data with answer, guidance, custom topics, and strategies
 * Optimized for single question view in assessment engine
 */
export async function getCompleteQuestionData(
  assessmentId: string,
  questionId: string
) {
  const questionRepo = AppDataSource.getRepository(Question)
  const answerRepo = AppDataSource.getRepository(Answer)
  
  // Get question with guidance
  const question = await questionRepo.findOne({
    where: { id: questionId },
    relations: ['guidance']
  })
  
  if (!question) {
    throw new Error('Question not found')
  }

  // Get answer with strategies
  const answer = await answerRepo.findOne({
    where: { assessmentId, questionId },
    relations: ['strategies', 'strategies.createdBy']
  })

  // Get custom topics
  const customTopics = await getCustomTopicsForQuestion(assessmentId, questionId)

  return {
    question,
    answer,
    customTopics,
    strategies: answer?.strategies || []
  }
}
