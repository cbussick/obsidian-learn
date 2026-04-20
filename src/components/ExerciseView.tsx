import React, { useState } from "react";
import { App, Notice } from "obsidian";
import { Exercise, ExerciseType } from "schema/Exercise";
import { saveExercise } from "saveExercise";
import styles from "./ExerciseView.module.css";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { SingleChoiceExercise } from "./SingleChoiceExercise";

interface ExerciseViewProps {
  onQuit: () => void;
  currentExercise: Exercise;
  currentIndex: number;
  exerciseAmount: number;
  onNextExercise: () => void;
  app: App;
  saveFolder: string;
}

const exerciseComponentMap = {
  [ExerciseType.SingleChoice]: SingleChoiceExercise,
  [ExerciseType.MultipleChoice]: MultipleChoiceExercise,
} as const;

export const ExerciseView = ({
  onQuit,
  currentExercise,
  currentIndex,
  exerciseAmount,
  onNextExercise,
  app,
  saveFolder,
}: ExerciseViewProps) => {
  const [isFinished, setFinished] = useState<boolean>(false);

  const handleSave = () => {
    saveExercise(app, currentExercise, saveFolder)
      .then(() => new Notice("Exercise saved."))
      .catch((e: Error) => new Notice(`Failed to save: ${e.message}`));
  };

  const ExerciseComponent: React.ComponentType<{
    exercise: Exercise;
    onFinishExercise: () => void;
    isFinished: boolean;
  }> = exerciseComponentMap[currentExercise.type];

  const onMoveToNextExercise = () => {
    setFinished(false);
    onNextExercise();
  };

  return (
    <div>
      <div>{`Exercise ${currentIndex + 1} of ${exerciseAmount}`}</div>
      <ExerciseComponent
        exercise={currentExercise}
        onFinishExercise={() => setFinished(true)}
        isFinished={isFinished}
      />

      <hr className={styles.hr} />

      <div className={styles.footerBar}>
        <button onClick={onQuit} className={styles.quitButton}>
          Quit
        </button>

        <div className={styles.footerRightButtonGroup}>
          <button onClick={onMoveToNextExercise} disabled={isFinished}>
            Skip
          </button>
          <button onClick={handleSave}>
            Save
          </button>
          <button onClick={onMoveToNextExercise} disabled={!isFinished}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
