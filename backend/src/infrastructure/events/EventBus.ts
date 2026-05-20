import { DomainEvent } from "../../domain/events/PurchaseEvents";

type Listener = (event: DomainEvent) => void;

export class EventBus {
  private static listeners: Listener[] = [];

  static publish(event: DomainEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  static subscribe(listener: Listener) {
    this.listeners.push(listener);
  }
}