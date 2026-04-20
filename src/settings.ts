import { App, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import Learn from "./main";

export interface LearnSettings {
	openAIKeyName: string;
}

export const DEFAULT_SETTINGS: LearnSettings = {
	openAIKeyName: "",
}

export class LearnSettingTab extends PluginSettingTab {
	plugin: Learn;

	constructor(app: App, plugin: Learn) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("OpenAI API key")
			.setDesc("Select or create a secret for your OpenAI API key.")
			.addComponent(el => new SecretComponent(this.app, el)
				.setValue(this.plugin.settings.openAIKeyName)
				.onChange(async (value) => {
					this.plugin.settings.openAIKeyName = value;
					await this.plugin.saveSettings();
				}));
	}
}
