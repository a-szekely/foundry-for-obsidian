import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting } from 'obsidian';
import { FoundryForObsidianSettings, DEFAULT_SETTINGS, FoundrySettingsTab } from './settings';
import { FoundryClient } from "src/foundry"
import { createPublicOauthClient, PublicOauthClient } from "@osdk/oauth";
import { Client, createClient, Osdk } from "@osdk/client";
import nfetch, {Headers, Request, Response} from "node-fetch";


// @ts-ignore
globalThis.fetch = nfetch
// @ts-ignore
globalThis.Headers = Headers
// @ts-ignore
globalThis.Request = Request
// @ts-ignore
globalThis.Response = Response

export default class FoundryForObsidian extends Plugin {
	settings: FoundryForObsidianSettings;
	foundryClient: Client;
	foundryAuth: PublicOauthClient

	async onload() {
		await this.loadSettings();


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new FoundrySettingsTab(this.app, this));
		
		// authenticate to Foundry
		const foundryAuth = createPublicOauthClient(this.settings.clientId, this.settings.foundryUrl, "http://localhost:8080/auth/callback")
		this.foundryClient = createClient(this.settings.foundryUrl, this.settings.ontologyRid, foundryAuth);

		// register action to call AIP
		this.addCommand({
			id: 'authenticate-foundry',
			name: 'Authenticate to Foundry',
			callback: () => {
				foundryAuth.refresh().catch(() =>foundryAuth.signIn())
				}
		});
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
