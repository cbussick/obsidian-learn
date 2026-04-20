import { useState } from "react";
import { MultipleChoiceExerciseData } from "schema/Exercise";
import styles from "./SingleChoiceExercise.module.css";

interface MultipleChoiceExerciseProps {
  exercise: MultipleChoiceExerciseData;
  onFinishExercise: () => void;
  isFinished: boolean;
}

export const MultipleChoiceExercise = ({
  exercise,
  onFinishExercise,
  isFinished,
}: MultipleChoiceExerciseProps) => {
  const { question, options, correctOptionsIndices } = exercise;
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const isCorrectOption = (option: string) => {
    let isCorrect = false;
    correctOptionsIndices.forEach((index) => {
      if (!isCorrect) {
        isCorrect = options[index] === option;
      }
    });

    return isCorrect;
  };

  const onClickButton = (option: string) => {
    if (isCorrectOption(option)) {
      if (selectedIndices.length < correctOptionsIndices.length - 1) {
        setSelectedIndices([
          ...selectedIndices,
          options.findIndex((currentOption) => currentOption === option),
        ]);
      } else {
        onFinishExercise();
      }
    } else {
      onFinishExercise();
    }
  };

  const getButtonClassname = (option: string) => {
    if (
      isFinished ||
      selectedIndices.includes(
        options.findIndex((currentOption) => currentOption === option),
      )
    ) {
      if (isCorrectOption(option)) {
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
              onClick={() => onClickButton(option)}
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
