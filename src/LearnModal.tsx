import { ExerciseWrapper } from "components/ExerciseWrapper";
import { App, Modal } from "obsidian";
import { createRoot } from "react-dom/client";

export class LearnModal extends Modal {
  constructor(app: App) {
    super(app);

    this.modalEl.setCssProps({ width: "70vw" });
    this.setTitle("Learn 🎓");

    const root = createRoot(this.contentEl);
    root.render(<ExerciseWrapper app={this.app} />);
  }
}
