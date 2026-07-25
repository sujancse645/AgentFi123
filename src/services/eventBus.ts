type EventType = 
  | "AgentStateChange" 
  | "TransactionEvent" 
  | "SimulationEvent" 
  | "MarketEvent" 
  | "WalletEvent"
  | "SystemHealthEvent";

export interface EventPayload {
  type: EventType;
  timestamp: number;
  data: any;
}

type EventCallback = (payload: EventPayload) => void;

class EventBus {
  private listeners: Map<EventType, Set<EventCallback>> = new Map();
  private history: EventPayload[] = [];

  subscribe(type: EventType, callback: EventCallback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Provide initial history to the new subscriber if needed (optional)
    // this.history.filter(e => e.type === type).forEach(callback);

    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  }

  subscribeAll(callback: EventCallback) {
    const allTypes: EventType[] = ["AgentStateChange", "TransactionEvent", "SimulationEvent", "MarketEvent", "WalletEvent", "SystemHealthEvent"];
    const unsubs = allTypes.map(type => this.subscribe(type, callback));
    return () => unsubs.forEach(unsub => unsub());
  }

  emit(type: EventType, data: any) {
    const payload: EventPayload = {
      type,
      timestamp: Date.now(),
      data
    };
    
    // Keep last 100 events in memory
    this.history = [payload, ...this.history].slice(0, 100);

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(callback => callback(payload));
    }
  }

  getHistory(type?: EventType) {
    return type ? this.history.filter(e => e.type === type) : this.history;
  }
}

export const eventBus = new EventBus();
