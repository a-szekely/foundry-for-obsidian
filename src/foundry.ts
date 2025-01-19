import { Client, createClient, Osdk } from "@osdk/client";
import { createConfidentialOauthClient } from "@osdk/oauth";
import { NoteObsidianPlugIn } from "@obsidian-dev/sdk";

const client_id: string = "";
const url: string = "";
const ontologyRid: string = "";
const client_secret: string = "";

const auth = createConfidentialOauthClient(client_id, client_secret, url);
const client: Client = createClient(url, ontologyRid, auth);

export async function fetchObjects(): Promise<Osdk.Instance<NoteObsidianPlugIn>[]> {
    const objects = (await client(NoteObsidianPlugIn).fetchPage({ $pageSize: 10 }));
    return objects.data;
}

fetchObjects()
    .then((objects: Osdk.Instance<NoteObsidianPlugIn>[]) => {
        console.log(objects);
    })
    .catch(error => {
        console.error("Error fetching NoteObsidianPlugIn:", error);
    });