import events, { BrynjolfEvents } from "./manager.js";

/**
 * A powerful Typescript decorator function, enabling simple, 
 * modular listeners to be built into classes.
 * 
 * > **⚠️ Requires Typescript 5 or greater.**
 * 
 * @example
 * // Note: DO NOT DIRECTLY COPY THIS EXAMPLE -
 * // it uses fake ＠ symbols due to jsdoc limitations. 
 * 
 * // Reacts with 👍 on the third message received
 * class MessageApprover {
 *  private messageCount: number = 0;
 * 
 *  ＠listener("messageCreate")
 *  onMessage(message: Message) {
 *      this.messageCount++;
 *      if (this.messageCount == 3) message.react("👍");
 *  }
 * }
*/
export function listener(event: keyof BrynjolfEvents, once = false) {
    return function listenerDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function() {
            if (once) events.once(event, originalMethod.bind(this));
            else events.on(event, originalMethod.bind(this));
        });

        return originalMethod;
    }
}