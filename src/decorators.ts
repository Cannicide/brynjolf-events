import type { ClientEvents } from "discord.js";
import events from "./manager.js";

export function listener(event: "*"|keyof ClientEvents, once = false) {
    return function listenerDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function() {
            if (once) events.once(event, originalMethod.bind(this));
            else events.on(event, originalMethod.bind(this));
        });

        return originalMethod;
    }
}