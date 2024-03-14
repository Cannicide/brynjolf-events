import type { AnySelectMenuInteraction, AutocompleteInteraction, ButtonInteraction, Client, ClientEvents, CommandInteraction, Interaction, ModalSubmitInteraction } from "discord.js";
import EventEmitter from "events";

interface BrynjolfEvents extends ClientEvents {
    "*": [eventName: keyof ClientEvents, data: any[]];
    "buttonUse": [interaction: ButtonInteraction];
    "selectUse": [interaction: AnySelectMenuInteraction];
    "commandUse": [interaction: CommandInteraction];
    "modalSubmit": [interaction: ModalSubmitInteraction];
    "autocomplete": [interaction: AutocompleteInteraction];
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

        // Attach new events
        this._client.on("interactionCreate", (interaction: Interaction) => {
            if (interaction.isButton()) this.emit("buttonUse", interaction);
            else if (interaction.isAnySelectMenu()) this.emit("selectUse", interaction);
            else if (interaction.isCommand()) this.emit("commandUse", interaction);
            else if (interaction.isModalSubmit()) this.emit("modalSubmit", interaction);
            else if (interaction.isAutocomplete()) this.emit("autocomplete", interaction);
        });
    }

    public emit<Event extends keyof BrynjolfEvents>(eventName: Event, ...args: BrynjolfEvents[Event]): boolean {
        return super.emit<Event>(eventName, ...args);
    }
}

const events = new EventManager();
export default events;