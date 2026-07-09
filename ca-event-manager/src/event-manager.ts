export class EventManager {

    constructor() {}

    public dispatch(eventName: string, ...params: any[]) {
        const event = new CustomEvent(eventName, { detail: params });
        window.dispatchEvent(event);
    }
    
}