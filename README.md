# Brynjolf Events
Easily create Discord.js event listeners without needing a Client variable 
reference everytime, in Javascript or Typescript. Also includes a powerful 
listener decorator system that enables stateful, modular listener creation 
for Typescript users.

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
### Modular Listeners
> **Requires Typescript >= v5**

Using the power of decorators, you can easily create modular 
classes to handle events. A class can handle any number of events.
The events are only handled once the class is constructed into an object. 
Unfortunately, Javascript does not officially support decorators yet, so 
this is a Typescript-only feature for the moment.

approver_example.ts:
```ts
import { listener } from "@brynjolf/events"
import type { Message } from "discord.js"

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
```

index.ts:
```ts
import { events } from "@brynjolf/events"
import { Client, IntentsBitField } from "discord.js"

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
> **Works in Javascript or Typescript**

Easily create event listeners without needing an immediate reference 
to a `Client`. Just supply a `Client` once in your main file, and all 
listeners will work.

message_example.js:
```js
import { events } from "@brynjolf/events"

events.on("messageCreate", message => {
    message.reply("Hello there!");
});
```

index.js:
```js
import { events } from "@brynjolf/events"
import { Client, IntentsBitField } from "discord.js"

// Import your event files
import "message_example.js";

// Create Discord.js client
const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
]});
client.login("YOUR TOKEN HERE");

// Set client in events system
events.client(client);
```

### All Event
> **Works in Javascript or Typescript**

The all (`*`) event is emitted when any other event is emitted, 
providing you the name of the emitted event and its arguments.

```js
import { events } from "@brynjolf/events"

events.on("*", (eventName, args) => {
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

This obviously requires you to create a Discord.js `Client` and 
supply it via `events.client()`, just like the above examples.

## Docs
For examples, see the quick examples above. They cover most, if 
not all, of this package's functionality.

[Primary Features →](modules/Members.html)\
[Typescript Types →](modules/Types.html)\
[Examples →](#quick-examples)