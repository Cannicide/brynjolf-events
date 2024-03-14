import fs from "node:fs";
import { listener, events } from "../lib/index.js";
import { Client, IntentsBitField, Message } from "discord.js";

// Basic typescript example
/*
    Easily create event listeners
    using typescript decorators,
    without needing access to a
    Discord.js Client variable!
*/

class MessageApprover {
    private messageCount: number = 0;

    @listener("messageCreate")
    onMessage(message: Message) {
        // React with 👍 on the third message received
        this.messageCount++;
        if (this.messageCount == 3) message.react("👍");
    }
}

new MessageApprover();

// Basic javascript example
/*
    Create event listeners
    without needing access to a
    Discord.js Client variable!
*/

events.on(
    "messageCreate", 
    (m: Message) => console.log("JM:", m.content)
);

// Create and initialize Discord.js client
const token = fs.readFileSync("./test/.env.local").toString("utf8").slice(6);
const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent, // Required for javascript example
    IntentsBitField.Flags.GuildMessages // Required for typescript example
]});
client.login(token);
events.client(client);