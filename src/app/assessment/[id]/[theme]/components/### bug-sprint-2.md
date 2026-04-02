### bug-sprint-2

- higher priority
	- [[Tasks/RD-119]] Footer became transparent. Should we add a background color from the element above?
		- src/components/Footer/index.tsx
	- [[Tasks/RD-97]] When in a rich text you put a text with an hyperlink, the flow is correct but the link created, when clicking it, doesn’t lead to the correct URL. Should we make sure formatting is not lost for link resources?
		- src/components/assessment/ChakraRichTextEditor.tsx
	- [[Tasks/RD-123]] The question's strategies example at Strategies.tsx (`{question.strategyExamples ? ...`}) should show examples  strategies with bullet points for all languages but the bullets on English are not displaying, likely because the format was lost in the import. Should we fix the importing scripts and sanitation functions? or should we add any required change directly?
		- src/app/assessment/[id]/[theme]/components/QuestionContent.tsx
		- src/app/assessment/[id]/[theme]/components/Strategies/index.tsx
		- questions "question.followUpQuestions" FollowUp questions "if yes" and "if not" are not being correctly shown conditionally for other languages likely because the conditions for other languages hasn't been implemented
			- src/components/assessment/FollowUpQuestions.tsx
- lower
	- [[Tasks/RD-105]] the whole page has a slightly horizontal scroll on the document
		- src/app/layout.tsx
	- [[Tasks/RD-101]] Notes panel should not have the header text ({t('assessment.guidance.notesCaption')}) and the editor box should take the whole space of the container in height, respecting the paddings
		- src/app/assessment/[id]/[theme]/components/GuidanceSidebar.tsx