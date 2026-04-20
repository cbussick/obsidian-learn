import { App, stringifyYaml } from "obsidian";
import { Exercise } from "schema/Exercise";

const formatExerciseAsMarkdown = (exercise: Exercise): string => {
  const frontmatter = stringifyYaml(exercise);
  return `---\n${frontmatter}---\n`;
};

export const saveExercise = async (
  app: App,
  exercise: Exercise,
  folderPath: string,
): Promise<void> => {
  const folder = app.vault.getFolderByPath(folderPath);
  if (!folder) {
    await app.vault.createFolder(folderPath);
  }

  const fileName = `${folderPath}/${exercise.id}.md`;
  const content = formatExerciseAsMarkdown(exercise);

  await app.vault.create(fileName, content);
};
