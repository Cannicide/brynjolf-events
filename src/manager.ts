import type { Client, ClientEvents } from "discord.js";
import EventEmitter from "node:events";

interface BrynjolfEvents extends ClientEvents {
    "*": [eventName: keyof ClientEvents, data: any[]];
}

class EventManager extends EventEmitter {
    private _client?: Client;

    public client(client: Client) {
        this._client = client;

        // Avoid already-patched Client
        if (Reflect.get(this._client, "_brynjolf_patched")) return;

        // Monkey patch Client emitter
        const emit = this._client.emit.bind(this._client);
        this._client.emit = <Event extends keyof ClientEvents>(event: Event, ...data: BrynjolfEvents[Event]) => {
            this.emit(event, ...data);
            this.emit("*", event as keyof ClientEvents, data);
            return emit(event as keyof ClientEvents, ...data);
        };
        Reflect.set(this._client, "_brynjolf_patched", true);
    }

    public emit<Event extends keyof BrynjolfEvents>(eventName: Event, ...args: BrynjolfEvents[Event]): boolean {
        return super.emit<Event>(eventName, ...args);
    }
}

const events = new EventManager();
export default events;
export { EventManager, BrynjolfEvents };