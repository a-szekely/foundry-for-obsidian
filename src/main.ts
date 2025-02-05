import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, requestUrl, Setting } from 'obsidian';
import { FoundryForObsidianSettings, DEFAULT_SETTINGS, FoundrySettingsTab } from './settings';
import { FoundryAuth } from "src/foundry"
import { createPublicOauthClient, PublicOauthClient } from "@osdk/oauth";
import { Client, createClient, Osdk } from "@osdk/client";

export default class FoundryForObsidian extends Plugin {
	settings: FoundryForObsidianSettings;
	foundryClient: Client;
	foundryAuth: FoundryAuth;
	window: any;


	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new FoundrySettingsTab(this.app, this));
		
		this.registerObsidianProtocolHandler('foundry-oauth', (params) => {
			console.log(JSON.stringify(params))
			foundryAuth.completeSignIn(params.code, params.state)
		  })
		

		// replace with
		// const { BrowserWindow } = require('@electron/remote')
		// when Obsidian updates to Electron 14



		// authenticate to Foundry
		const foundryAuth = new FoundryAuth(this.settings.clientId, this.settings.foundryUrl, "obsidian://foundry-oauth")
		// createPublicOauthClient(this.settings.clientId, this.settings.foundryUrl, "obsidian://foundry-oauth")
		// this.foundryClient = createClient(this.settings.foundryUrl, this.settings.ontologyRid, foundryAuth);

		// register action to call AIP
		this.addCommand({
			id: 'authenticate-foundry',
			name: 'Authenticate to Foundry',
			callback: () => {

				// this.window = new remote.BrowserWindow({ parent: remote.getCurrentWindow(), modal: true });
				foundryAuth.initiateSignIn()

				
				// foundryAuth.refresh().catch(() =>{
				// 	foundryAuth.signIn().then(() => console.log(foundryAuth.getTokenOrUndefined()))
				// })
			}
		});

		this.addCommand({
			id: 'open-webpage-test',
			name: 'Open Webpage Test',
			callback: () => {
				// this.window = new remote.BrowserWindow({ parent: remote.getCurrentWindow(), modal: true });
				this.window = new remote.BrowserWindow();
				this.window.loadURL('https://www.google.com');
				// this.window = window.open('https://www.google.com')!;


				
			}
		})

		this.addCommand({
			id: 'close-webpage-test',
			name: 'Close Webpage Test',
			callback: () => {
				this.window.close();
			}
		})

		this.addCommand({
			id: 'check-foundry-token',
			name: 'Check Foundry Token',
			callback: () => {
				console.log(foundryAuth.getTokenOrUndefined())
				console.log(JSON.stringify(foundryAuth))
				// foundryAuth.refresh().catch(() =>{
				// 	foundryAuth.signIn().then(() => console.log(foundryAuth.getTokenOrUndefined()))
				// })
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
