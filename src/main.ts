import { LearnModal } from "LearnModal";
import { Plugin, TFile } from "obsidian";
import { DEFAULT_SETTINGS, LearnSettings, LearnSettingTab } from "./settings";

// Remember to rename these classes and interfaces!

export default class Learn extends Plugin {
  settings: LearnSettings;

  async onload() {
    await this.loadSettings();

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("Status bar text");

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "open-note-selector",
      name: "Open note selector",
      callback: () => {
        new LearnModal(this.app, this.settings).open();
      },
    });
    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: "generate-exercises-for-current-note",
      name: "Generate exercises for current note",
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const activeFile: TFile | null = this.app.workspace.getActiveFile();

        if (activeFile) {
          if (!checking) {
            new LearnModal(this.app, this.settings, [activeFile], true).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
        return false;
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new LearnSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<LearnSettings>,
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
