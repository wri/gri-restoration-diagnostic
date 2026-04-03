### bug-sprint-2-review-fixes

You are now in branch `bug-sprint-2-review-fixes`. Your task is to branch out for every Task naming the branch using the name/code after the `/` and address each task instruction

Once you are done addressing each task instructions, try to push your changes to remote, so that we can trigger a review process once we open each corresponding PR using the aforementioned branch as base

- Tasks:
  - [[Tasks/RD-93]] downloading the strategies
    - status field:
      - we've included a new property to the strategies called 'status', now this field needs to be added to the form at
        - src/app/assessment/[id]/[theme]/components/Strategies/index.tsx
      - this field is a textInput, before it was using `AnswerStatus` enum, but it now is a user  entered value
      - the property value besides visible in form/edit, should also be shown in read only mode at
        - src/app/assessment/[id]/[theme]/components/Strategies/ReadOnly.tsx
      - see also
        - src/types/answer.types.ts:7
    - deadline field: field label should be change into 'Estimated start date' in the form for adding strategies
    - all changes should also be reflected in the translations
  - [[Tasks/RD-103]] contributors field functionality
    - When the list is empty show a message to let them know the is no record. Use  'No matches found'
    - While writing show as being selected the first best matching option so that if the user click 'enter' that option is selected. If there are no results available for what is written, then it should be the create functionality.
    - translations should be inclued