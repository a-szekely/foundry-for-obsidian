import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { FoundryForObsidianSettings, DEFAULT_SETTINGS, FoundrySettingsTab } from './settings';
// import {fetchObjects} from "src/foundry"

export default class FoundryForObsidian extends Plugin {
	settings: FoundryForObsidianSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new FoundrySettingsTab(this.app, this));
		
		// authenticate to Foundry

		// register action to call AIP

		// register action to re-sync notes

		// register events

		// add status bar element to show sync status
		this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => { console.info('changed leaf', leaf)}));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5000000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
