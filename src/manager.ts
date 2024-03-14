import type { Client, ClientEvents } from "discord.js";
import EventEmitter from "events";

class EventManager extends EventEmitter {
    private _client?: Client;

    public client(client: Client) {
        this._client = client;

        // Monkey patch Client emitter
        const emit = this._client.emit.bind(this._client);
        this._client.emit = <Event extends keyof ClientEvents>(event: Event, ...data: ClientEvents[Event]) => {
            this.emit(event, ...data);
            this.emit("*", event, ...data);
            return emit(event, ...data);
        };
    }
}

const events = new EventManager();
export default events;