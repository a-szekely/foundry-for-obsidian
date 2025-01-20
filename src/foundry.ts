import { Client, createClient, Osdk } from "@osdk/client";
import { createPublicOauthClient } from "@osdk/oauth";
import { NoteObsidianPlugIn } from "@foundry-for-obsidian/sdk";

import nfetch, {Headers, Request, Response, RequestInfo, RequestInit} from "node-fetch";

export class FoundryClient {
    clientId: string;
    foundryUrl: string;
    ontologyRid: string;

    client: Client;

    constructor(clientId: string, foundryUrl: string, ontologyRid: string) {
        this.clientId = clientId;
        this.foundryUrl = foundryUrl;
        this.ontologyRid = ontologyRid;

    }

    async fetchObjects(): Promise<Osdk.Instance<NoteObsidianPlugIn>[]> {
        console.log(JSON.stringify(this.client))
        const objects = (await this.client(NoteObsidianPlugIn).fetchPage({ $pageSize: 10 }));
        console.log(objects);
        return objects.data;
    }

}