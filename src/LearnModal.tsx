import { ExerciseWrapper } from "components/ExerciseWrapper";
import { App, Modal, TFile } from "obsidian";
import { createRoot } from "react-dom/client";
import { LearnSettings } from "settings";

export class LearnModal extends Modal {
  constructor(app: App, settings: LearnSettings, notes?: TFile[], autoStart?: boolean) {
    super(app);

    this.modalEl.setCssProps({ width: "70vw" });
    this.setTitle("Learn 🎓");

    const root = createRoot(this.contentEl);
    root.render(
      <ExerciseWrapper app={this.app} settings={settings} notes={notes} autoStart={autoStart} />,
    );
  }
}
