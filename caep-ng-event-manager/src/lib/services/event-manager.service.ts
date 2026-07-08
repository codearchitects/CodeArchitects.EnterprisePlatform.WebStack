import { Injectable } from '@angular/core';
import { CaepEventMetadataKey, EventManager, ICaepEventMetadata } from '@caep/event-manager';

@Injectable()
export class CaepEventManagerService {

  private _eventManager: EventManager = new EventManager();
  private _componentEventHandlersList: Array<{ component: any, eventHandlers: Array<{ eventName: string; handler: EventListenerOrEventListenerObject; }> }> = [];
  private _eventHandlersList: Array<{ eventName: string; handler: Function; wrappedHandler: EventListenerOrEventListenerObject; }> = [];

  constructor() { }

  public dispatch(eventName: string, ...params: any[]) {
    this._eventManager.dispatch(eventName, ...params);
  }

  public registerEventListeners(component: any) {
    const eventHandlers: Array<{
      eventName: string;
      handler: EventListenerOrEventListenerObject;
    }> = [];
    if(this._componentEventHandlersList.find((obj) => obj.component === component)) {
      return;
    } else {
      let prototype = Object.getPrototypeOf(component);
      for (; prototype != Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
        let props = Object.keys(prototype);
        for(const prop of props) {
          const eventMetadata = Reflect['getOwnMetadata'](CaepEventMetadataKey, prototype, prop) as ICaepEventMetadata;
          if(eventMetadata) {
            const handler = ((event: CustomEvent) => {
              component[prop](...event.detail);
            });
            eventHandlers.push({ eventName: eventMetadata.name, handler });
            window.addEventListener(eventMetadata.name, handler);
          }
        }
      }
      this._componentEventHandlersList.push({ component, eventHandlers });
    }
  }

  public removeEventListeners(component: any) {
    const index = this._componentEventHandlersList.findIndex((obj) => obj.component === component);
    if(index > -1) {
      if(this._componentEventHandlersList[index].eventHandlers.length > 0) {
        this._componentEventHandlersList[index].eventHandlers.forEach((eventHandler) => window.removeEventListener(eventHandler.eventName, eventHandler.handler));
      }
      this._componentEventHandlersList.splice(index, 1);
    }
  }

  public registerEventListener(eventName: string, eventHandler: Function, context?: any) {
    if(eventName && eventHandler) {
      const wrappedHandler = ((event: CustomEvent) => {
        if(context)
          eventHandler.call(context, ...event.detail);
        else
          eventHandler(...event.detail);
      });
      this._eventHandlersList.push({ eventName, handler: eventHandler, wrappedHandler });
      window.addEventListener(eventName, wrappedHandler);
    }
  }

  public removeEventListener(eventName: string, eventHandler: Function) {
    if(eventName && eventHandler) {
      const index = this._eventHandlersList.findIndex((obj) => obj.handler === eventHandler);
      if(index > -1) {
        window.removeEventListener(this._eventHandlersList[index].eventName, this._eventHandlersList[index].wrappedHandler);
        this._eventHandlersList.splice(index, 1);
      }
    }
  }

}
