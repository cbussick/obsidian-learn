import { App, TFile } from "obsidian";
import { Exercise, ExerciseType } from "schema/Exercise";
import { createOpenAIClient, parseExercisesResponse } from "./openaiClient";

const AVAILABLE_EXERCISE_TYPES = Object.values(ExerciseType).join(", ");

export const fetchOpenAIResponseExercisesAll = async (
  openAIAPIKey: string,
  notes: TFile[],
  app: App,
): Promise<Exercise[]> => {
  const notesTexts = await Promise.all(
    notes.map((note) => app.vault.read(note)),
  );

  const prompt = `Generate exercises for each of these notes. Decide yourself how many exercises to generate and which types are most appropriate for the content. You may only use the following exercise types: ${AVAILABLE_EXERCISE_TYPES}. The notes: ${JSON.stringify(notesTexts)}.`;

  return parseExercisesResponse(createOpenAIClient(openAIAPIKey), prompt);
};
