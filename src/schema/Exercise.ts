import z from "zod";

export const ExerciseType = {
  SingleChoice: "single-choice",
  MultipleChoice: "multiple-choice",
} as const;

export type ExerciseType = (typeof ExerciseType)[keyof typeof ExerciseType];

export const SingleChoiceExerciseSchema = z.object({
  type: z.literal(ExerciseType.SingleChoice),
  question: z.string(),
  options: z.array(z.string()),
  correctOptionIndex: z.number(),
});

export const MultipleChoiceExerciseSchema = z.object({
  type: z.literal(ExerciseType.MultipleChoice),
  question: z.string(),
  options: z.array(z.string()),
  correctOptionsIndices: z.array(z.number()),
});

export const ExerciseSchema = z.union([
  SingleChoiceExerciseSchema,
  MultipleChoiceExerciseSchema,
]);

export const ExerciseAIResponseSchema = z.object({
  exercises: z.array(ExerciseSchema),
});

export type SingleChoiceExerciseData = z.output<
  typeof SingleChoiceExerciseSchema
> & { id: string };

export type MultipleChoiceExerciseData = z.output<
  typeof MultipleChoiceExerciseSchema
> & { id: string };

export type Exercise = z.output<typeof ExerciseSchema> & { id: string };
