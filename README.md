# Brynjolf Events
Easily create Discord.js event listeners without needing a Client variable reference everytime, in Javascript or Typescript. Also includes a powerful listener decorator system that enables stateful, modular listener creation for Typescript users.

## Features
- Create Discord.js event listeners without Client
- Typescript decorators to convert classes into modular listeners
- 🪶 Lightweight, **zero** dependencies
- 🍰 Extremely easy to use
<!-- - 🧩 Fully documented -->
- New `*` event emitted alongside all other events
- 🧠 Built with Typescript, providing great IDE intellisense

## Get Started
1. Create a Discord.js client
2. Install Brynjolf Events with `npm install @brynjolf/events`
3. Run the quick example below, or skip the tutorial and jump right in

## Quick Examples
### Modular Listeners (Typescript Only)
Using the power of decorators, you can easily create modular 
classes to handle events. A class can handle any number of events. The events are only handled once the class is constructed into an object. Unfortunately, Javascript does not officially support decorators yet, so this is a Typescript-only 
feature for the moment.

```ts
import { listener, events } from "@brynjolf/events"
import { Client, IntentsBitField, Message } from "discord.js"

// Reacts with 👍 on the third message received
class MessageApprover {
    private messageCount: number = 0;

    @listener("messageCreate")
    onMessage(message: Message) {
        this.messageCount++;
        if (this.messageCount == 3) message.react("👍");
    }
}

// Construct
new MessageApprover();

// Create Discord.js client
const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages
]});
client.login("YOUR TOKEN HERE");

// Set client in events system
events.client(client);
```

### No-Client Listeners
```js
// TODO
```

### All Event
The all (`*`) event is emitted when any other event is emitted, 
providing you the name of the emitted event and its arguments.

```js
import { events } from "@brynjolf/events"

events.on("*", (eventName, ...args) => {
    console.log(`Event '${eventName}' was triggered.`);
});

// Message sent:
// => "Event 'messageCreate' was triggered."

// Slash command used:
// => "Event 'interactionCreate' was triggered."

// Message deleted:
// => "Event 'messageDelete' was triggered."

// And so on...
```