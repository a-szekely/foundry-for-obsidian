import { authorizationCodeGrantRequest, calculatePKCECodeChallenge, generateRandomCodeVerifier, generateRandomState, processAuthorizationCodeOAuth2Response, refreshTokenGrantRequest, validateAuthResponse } from "oauth4webapi";

import { Client, createClient, Osdk } from "@osdk/client";
import { NoteObsidianPlugIn } from "@foundry-for-obsidian/sdk";

import nfetch, {Headers, Request, Response, RequestInfo, RequestInit} from "node-fetch";

export class FoundryAuth {
    window: Window;
    clientId: string;
    foundryUrl: string;
    redirectUrl: string;
    codeVerifier: string | null = null;
    state: string | null = null;

    constructor(clientId: string, foundryUrl: string, redirectUrl: string) {
        this.clientId = clientId;
        this.foundryUrl = foundryUrl;
        this.redirectUrl = redirectUrl;
    }

    async initiateSignIn(): Promise<void> {
        // Generate random state and code verifier
        this.state = generateRandomState();
        this.codeVerifier = generateRandomCodeVerifier();

        // Calculate the code challenge
        const codeChallenge = await calculatePKCECodeChallenge(this.codeVerifier);


        // Construct the authorization URL
        const authUrl = new URL(`${this.foundryUrl}/multipass/api/oauth2/authorize`);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('client_id', this.clientId);
        authUrl.searchParams.set('redirect_uri', this.redirectUrl);
        authUrl.searchParams.set('state', this.state);
        authUrl.searchParams.set('scope', 'api:read-data api:write-data offline_access');
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        // Open a new window for authentication
        this.window = window.open(authUrl.toString(), 'FoundryAuth', 'popup=False')!;
        console.log(JSON.stringify(this.window))
    }

    async completeSignIn(code: string, state: string): Promise<void> {
        console.log('Completing sign-in');
        // Validate the state
        if (this.state !== state) {
            throw new Error('Invalid state');
        }

        console.log(JSON.stringify(this.window))

        // Close the authentication window
        if (this.window) {
            console.log('Closing window')
            this.window.close();
        }

        // Prepare the token endpoint URL
        const tokenEndpoint = new URL(`${this.foundryUrl}/oauth/token`);

        // Prepare the token request
        const tokenRequest = new Request(tokenEndpoint.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.redirectUrl,
                client_id: this.clientId,
                code_verifier: this.codeVerifier!
            })
        });

        try {
            // Send the token request
            const response = await nfetch(tokenRequest);
            console.log(response)
            if (!response.ok) {
                throw new Error(`Failed to get token: ${response.statusText}`);
            }

            // Process the token response
            const tokenResponse = await response.json();

            console.log(tokenResponse)

            // Store the token (you'll need to implement this part)
            this.storeToken(tokenResponse);

            // Clear the code verifier and state
            this.codeVerifier = null;
            this.state = null;
        } catch (error) {
            console.error('Error completing sign-in:', error);
            throw error;
        }
    }

    getTokenOrUndefined(): string | undefined {
        // Implement token retrieval logic here
        // This is a placeholder implementation
        return localStorage.getItem('foundryAccessToken') || undefined;
    }

    private storeToken(tokenResponse: any): void {
        // Implement token storage logic here
        // This is a placeholder implementation
        localStorage.setItem('foundryAccessToken', tokenResponse.access_token);
        if (tokenResponse.refresh_token) {
            localStorage.setItem('foundryRefreshToken', tokenResponse.refresh_token);
        }
    }
}