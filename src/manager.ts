import type { Client, ClientEvents } from "discord.js";
import EventEmitter from "node:events";

/**
 * Extended map of supported Discord.js events
 * to their event listener parameters.
 */
interface BrynjolfEvents extends ClientEvents {
    /** Global event, emitted when any other event is emitted. */
    "*": [eventName: keyof ClientEvents, data: any[]];
}

/**
 * A custom event emitter synchronized with Discord.js events. 
 * You should not need to use this class directly; instead, use
 * the {@link Members.events | events} member.
 */
class EventManager extends EventEmitter {
    /** @internal Internally used to store Client. */
    private _client?: Client;

    /** Sets the Discord.js `Client`, activating all event listeners. */
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

    /** 
     * Emits a Discord.js or Brynjolf event.
     * 
     * @example
     * events.emit("messageCreate", message);
     */
    public override emit<Event extends keyof BrynjolfEvents>(eventName: Event, ...args: BrynjolfEvents[Event]): boolean {
        return super.emit<Event>(eventName, ...args);
    }

    /**
     * Listens to a Discord.js or Brynjolf event.
     * 
     * @example
     * events.on("messageCreate", (message) => {
     *  console.log("Message was sent!");
     * });
     */
    public override on<Event extends keyof BrynjolfEvents>(eventName: Event, listener: (...args: BrynjolfEvents[Event]) => void): this {
        super.on(eventName, listener);
        return this;
    }

    /**
     * Listens to a Discord.js or Brynjolf event, but only **once**.
     * 
     * @example
     * events.once("messageCreate", (message) => {
     *  console.log("Message was sent!");
     *  console.log("Now this listener will be removed!");
     * });
     */
    public override once<Event extends keyof BrynjolfEvents>(eventName: Event, listener: (...args: BrynjolfEvents[Event]) => void): this {
        super.once(eventName, listener);
        return this;
    }

    /**
     * Removes a Discord.js or Brynjolf event listener.
     * 
     * @example
     * const callback = (message) => {
     *  console.log("Message was sent!");
     * });
     * 
     * events.on("messageCreate", callback);
     * // ...
     * events.off("messageCreate", callback);
     */
    public override off<Event extends keyof BrynjolfEvents>(eventName: Event, listener: (...args: BrynjolfEvents[Event]) => void): this {
        super.off(eventName, listener);
        return this;
    }
}

/** A global Discord.js event system for \@brynjolf/events. */
const events = new EventManager();
export default events;
export { EventManager, BrynjolfEvents };