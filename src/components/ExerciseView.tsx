import { TFile } from "obsidian";

interface Props {
  selectedNotes: TFile[];
  onBack: () => void;
}

export const ExerciseView = ({ selectedNotes, onBack }: Props) => {
  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <p>Exercises coming soon. Selected {selectedNotes.length} note(s).</p>
    </div>
  );
};
