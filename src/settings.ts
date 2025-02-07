import { App, PluginSettingTab, Setting, ButtonComponent } from 'obsidian';
import type FoundryForObsidian from "./main";

export interface FoundryForObsidianSettings {
	clientId: string;
	foundryUrl: string;
	ontologyRid: string;
}

export const DEFAULT_SETTINGS: FoundryForObsidianSettings = {
	clientId: "",
	foundryUrl: "",
	ontologyRid: ""
}

export class FoundrySettingsTab extends PluginSettingTab {
	plugin: FoundryForObsidian;

	constructor(app: App, plugin: FoundryForObsidian) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Client ID')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.clientId)
				.onChange(async (value) => {
					this.plugin.settings.clientId = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Foundry URL')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.foundryUrl)
				.onChange(async (value) => {
					this.plugin.settings.foundryUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Ontology RID')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.ontologyRid)
				.onChange(async (value) => {
					this.plugin.settings.ontologyRid = value;
					await this.plugin.saveSettings();
				}));

        // Add a new setting for the button
        new Setting(containerEl)
            .setName('Test Button')
            .setDesc('Click the button to test the function')
            .addButton((button: ButtonComponent) => {
                button
                    .setButtonText('Button')
                    .onClick(() => {
                        // Call the testFunction
                        const win = window.open("https://google.com");
                        console.log(JSON.stringify(win));
                        // Emit an onClick event
                    });
            });
	}
}