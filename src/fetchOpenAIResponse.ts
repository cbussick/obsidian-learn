import { App, TFile } from "obsidian";
import { Exercise, ExerciseType } from "schema/Exercise";
import { NoteExercisesToGenerate } from "schema/ExerciseToGenerate";
import { createOpenAIClient, parseExercisesResponse } from "./openaiClient";

export const fetchOpenAIResponseExercises = async (
  openAIAPIKey: string,
  notes: TFile[],
  app: App,
): Promise<Exercise[]> => {
  const notesTexts = await Promise.all(
    notes.map((note) => app.vault.read(note)),
  );

  const exercisesToGenerate: NoteExercisesToGenerate[] = notesTexts.map(
    (text) => ({
      noteText: text,
      exercises: [
        ExerciseType.SingleChoice,
        ExerciseType.MultipleChoice,
        ExerciseType.SingleChoice,
      ],
    }),
  );

  const prompt = `Generate exercises for each of these notes. You will receive a JSON array string which contains each note and an associated array with the exercises that should be generated based on the note. You should generate an exercise for each element in that associated exercises array. Each element describes the type of the exercise. The JSON array string: ${JSON.stringify(exercisesToGenerate)}.`;

  return parseExercisesResponse(createOpenAIClient(openAIAPIKey), prompt);
};
