import { App, PluginSettingTab, Setting } from "obsidian";
import Learn from "./main";

export interface LearnSettings {
	openAIKey: string;
}

export const DEFAULT_SETTINGS: LearnSettings = {
	openAIKey: 'default'
}

export class LearnSettingTab extends PluginSettingTab {
	plugin: Learn;

	constructor(app: App, plugin: Learn) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('OpenAI API key.')
			.setDesc('Your OpenAI API key.')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.openAIKey)
				.onChange(async (value) => {
					this.plugin.settings.openAIKey = value;
					await this.plugin.saveSettings();
				}));
	}
}
