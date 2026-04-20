import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { Exercise, ExerciseAIResponseSchema } from "schema/Exercise";

export const createOpenAIClient = (apiKey: string) =>
  new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export const parseExercisesResponse = async (
  client: OpenAI,
  prompt: string,
): Promise<Exercise[]> => {
  const response = await client.responses.parse({
    model: "gpt-5-mini",
    input: [{ role: "user", content: prompt }],
    text: { format: zodTextFormat(ExerciseAIResponseSchema, "exercises") },
  });

  return (response.output_parsed?.exercises ?? []).map((exercise: Exercise, index: number) => ({
    ...exercise,
    id: `${Date.now().toString()}_index-${index}`,
  }));
};
