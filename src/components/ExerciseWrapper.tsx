import { App, TFile } from "obsidian";
import { useMemo, useState } from "react";
import { ExerciseView } from "./ExerciseView";
import { NoteSelector } from "./NoteSelector";

const View = {
  Selection: "selection",
  Exercise: "exercise",
} as const;
type View = (typeof View)[keyof typeof View];

interface ExerciseWrapperProps {
  app: App;
}

export const ExerciseWrapper = ({ app }: ExerciseWrapperProps) => {
  const allNotes = useMemo(() => app.vault.getMarkdownFiles(), []);
  const [view, setView] = useState<View>(View.Selection);
  const [selectedNotes, setSelectedNotes] = useState<TFile[]>([]);

  const handleSelectNote = (note: TFile) => {
    setSelectedNotes((prev) => [...prev, note]);
  };

  const handleDeselectNote = (note: TFile) => {
    setSelectedNotes((prev) => prev.filter((n) => n.path !== note.path));
  };

  const handleStartExerciseMode = () => {
    setView(View.Exercise);
  };

  const handleBack = () => {
    setView(View.Selection);
  };

  if (view === View.Exercise) {
    return <ExerciseView selectedNotes={selectedNotes} onBack={handleBack} />;
  }

  return (
    <NoteSelector
      allNotes={allNotes}
      selectedNotes={selectedNotes}
      onSelect={handleSelectNote}
      onDeselect={handleDeselectNote}
      onStart={handleStartExerciseMode}
    />
  );
};
