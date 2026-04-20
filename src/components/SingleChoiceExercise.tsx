import { SingleChoiceExerciseData } from "schema/Exercise";
import styles from "./SingleChoiceExercise.module.css";

interface SingleChoiceExerciseProps {
  exercise: SingleChoiceExerciseData;
  onFinishExercise: () => void;
  isFinished: true;
}

export const SingleChoiceExercise = ({
  exercise,
  onFinishExercise,
  isFinished,
}: SingleChoiceExerciseProps) => {
  const { question, options, correctOptionIndex } = exercise;

  const getButtonClassname = (option: string) => {
    if (isFinished) {
      if (option === options[correctOptionIndex]) {
        return styles.buttonCorrect;
      }
      return styles.buttonIncorrect;
    }
    return undefined;
  };

  return (
    <div>
      <h4>{question}</h4>

      <div className={styles.optionsGrid}>
        {options.map((option) => {
          return (
            <button
              key={option}
              onClick={onFinishExercise}
              disabled={isFinished}
              className={`${styles.button} ${getButtonClassname(option)}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
