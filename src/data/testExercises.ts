import { Exercise } from "schema/Exercise";

export const testExercises: Exercise[] = [
  {
    type: "single-choice",
    question:
      "Which declaration keyword prevents reassigning a variable to a different value (i.e., you cannot point the variable to a new value)?",
    options: ["let", "const", "var", "None of the above"],
    correctOptionIndex: 1,
    id: "1776352556962_index-0",
  },
  {
    type: "multiple-choice",
    question:
      "Which of the following statements are true about variables and passing them to functions?",
    options: [
      "Variables are values.",
      "Variables point to values.",
      "Declaring with const makes object properties immutable.",
      "When passing a variable to a function, the function receives the value of the variable at that moment.",
    ],
    correctOptionsIndices: [1, 3],
    id: "1776352556962_index-1",
  },
  {
    type: "single-choice",
    question:
      "Which of the following correctly states the two rules for using the assignment operator (=) in JavaScript?",
    options: [
      "The left side must be a variable; the right side must be an expression.",
      "Both sides must be variables.",
      "The left side must be an expression; the right side must be a variable.",
      "Either side can be a value or an expression.",
    ],
    correctOptionIndex: 0,
    id: "1776352556962_index-2",
  },
  {
    type: "single-choice",
    question: 'In JavaScript, what is a "value"?',
    options: [
      "A variable that stores data.",
      "A piece of data that has a specific type (e.g., string, number, object).",
      "Only objects and arrays.",
      "A declaration keyword like let or const.",
    ],
    correctOptionIndex: 1,
    id: "1776352556962_index-3",
  },
  {
    type: "multiple-choice",
    question: "Which of the following are JavaScript value types?",
    options: ["String", "Number", "Object", "Value", "Boolean"],
    correctOptionsIndices: [0, 1, 2, 4],
    id: "1776352556962_index-4",
  },
  {
    type: "single-choice",
    question:
      "Which statement best captures the relationship between a JavaScript value and its type?",
    options: [
      "Every value has a specific type that describes what kind of data it is.",
      "A value only has a type if it's an object.",
      "Types are only applied to variables, not values.",
      "The keyword 'value' determines the type.",
    ],
    correctOptionIndex: 0,
    id: "1776352556962_index-5",
  },
];
