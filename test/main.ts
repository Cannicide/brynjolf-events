import { listener, events } from "../lib/index.js";
import EventEmitter from "events";

// Create pseudo-client
const client = new EventEmitter();

// Create decorated class
let messageDeleted = null;
const messageCreated: { content?: string, username?: string } = {
    content: undefined,
    username: undefined
};
class MessageListener {
    // @ts-ignore
    @listener("messageDeleteMock")
    onDelete(message: string) {
        messageDeleted = message;
    }

    // @ts-ignore
    @listener("messageCreateMock", true)
    onCreate(message: string, user: string) {
        messageCreated.content = message;
        messageCreated.username = user;
    }
}

// ==== TEST MESSAGE DELETE LISTENER ==== \\

// Ensure no handling before constructing class
client.emit("messageDeleteMock", "Unhandled");
console.log("TEST PASSING: ", messageDeleted == null);

// Construct class
new MessageListener();

// Set client
// @ts-ignore due to pseudo-client use
events.client(client);

// Ensure proper handling of event
client.emit("messageDeleteMock", "Test");
console.log("TEST PASSING: ", messageDeleted == "Test");

// ==== TEST MESSAGE CREATE LISTENER ==== \\

// Ensure proper handling of event
client.emit("messageCreateMock", "Hello There", "Kenobi");
const messageTest = () => messageCreated.content == "Hello There" && messageCreated.username == "Kenobi";
console.log("TEST PASSING: ", messageTest());

// Ensure event only triggers once
client.emit("messageCreateMock", "*Intense Coughing*", "Grievous");
console.log("TEST PASSING: ", messageTest());

// ==== TEST ACTUAL CLIENT ==== \\
import "./client.js";