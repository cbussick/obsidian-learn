import { fetchOpenAIResponseExercisesAll } from "fetchOpenAIResponseAuto";
import { App, Notice, TFile } from "obsidian";
import { useEffect, useMemo, useState } from "react";
import { Exercise } from "schema/Exercise";
import { LearnSettings } from "settings";
import { ExerciseView } from "./ExerciseView";
import styles from "./ExerciseWrapper.module.css";
import { NoteSelector } from "./NoteSelector";
import { Spinner } from "./Spinner";

const View = {
  Selection: "selection",
  Exercise: "exercise",
  Loading: "loading",
} as const;
type View = (typeof View)[keyof typeof View];

interface ExerciseWrapperProps {
  app: App;
  settings: LearnSettings;
  notes?: TFile[];
  autoStart?: boolean;
}

export const ExerciseWrapper = ({
  app,
  settings,
  notes,
  autoStart,
}: ExerciseWrapperProps) => {
  const allNotes = useMemo(() => app.vault.getMarkdownFiles(), []);
  const [view, setView] = useState<View>(
    autoStart && notes && notes.length > 0 ? View.Loading : View.Selection,
  );
  const [selectedNotes, setSelectedNotes] = useState<TFile[]>(
    notes && notes.length > 0 ? notes : [],
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);

  useEffect(() => {
    if (!autoStart || !notes || notes.length === 0) return;

    const apiKey = app.secretStorage.getSecret(settings.openAIKeyName);
    if (!apiKey) {
      new Notice("No OpenAI API key set.");
      setView(View.Selection);
      return;
    }

    fetchOpenAIResponseExercisesAll(apiKey, notes, app)
      .then((result) => {
        setExercises(result);
        setView(View.Exercise);
      })
      .catch((error: Error) => {
        new Notice(error.message);
        console.error(error.message);
        setView(View.Selection);
      });
  }, []);

  const handleSelectNote = (note: TFile) => {
    setSelectedNotes((prev) => [...prev, note]);
  };

  const handleDeselectNote = (note: TFile) => {
    setSelectedNotes((prev) => prev.filter((n) => n.path !== note.path));
  };

  const handleStartExerciseMode = (exercises: Exercise[]) => {
    setExercises(exercises);
    setView(View.Exercise);
  };

  const reset = () => {
    setExerciseIndex(0);
    setExercises([]);
    setView(View.Selection);
  };

  const handleQuit = () => {
    reset();
  };

  const handleNextExercise = () => {
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
    } else {
      reset();
    }
  };

  if (view === View.Loading) {
    return (
      <div className={styles.loadingView}>
        <Spinner size="2.5em" />
        <p>Generating exercises…</p>
      </div>
    );
  }

  if (view === View.Exercise && exercises[exerciseIndex]) {
    return (
      <ExerciseView
        onQuit={handleQuit}
        currentExercise={exercises[exerciseIndex]}
        currentIndex={exerciseIndex}
        exerciseAmount={exercises.length}
        onNextExercise={handleNextExercise}
        app={app}
        saveFolder="Learn/Saved"
      />
    );
  }

  return (
    <NoteSelector
      allNotes={allNotes}
      selectedNotes={selectedNotes}
      onSelect={handleSelectNote}
      onDeselect={handleDeselectNote}
      onStart={handleStartExerciseMode}
      app={app}
      settings={settings}
    />
  );
};
