export const STORAGE_KEY = "code-reviewer-config";

export const DEFAULT_SYSTEM_PROMPT = `Consider the provided files as ground truth templates, and student submissions for an assignment. Directly map the submission files to the template files based on their content, not the file names.

The maximum grade for the assignment is 10. Analyze the code and give each submission file a grade from 0 to 10 based on the correctness and similarity to the template file. If the code is not perfect but works, just give a 10. If there are critical flaws, reduce the grade according to the severity. For each submission, just give an overall grade and output a brief summary of issues only when the grade is deducted. Do not output positive feedback. Disregard anything related to comments or documentation.

Respond, for each template file, the submission grade alongside with any summary of issues. If there are missing submissions or submissions unrelated to a template file, grade the corresponding file as 0. In the end, output the total grade for the submission, which is the average of the given grades.

Only respond in Brazilian Portuguese.`;
