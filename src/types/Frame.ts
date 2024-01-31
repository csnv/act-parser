import { ActFile } from "./ActFile";
import { Action } from "./Action";
import { AnchorPoint } from "./AnchorPoint";
import { Layer } from "./Layer";

export class Frame {
    parentAction: Action;
    range1: number[];
    range2: number[];
    layers: Layer[];
    eventId: number;
    anchorPoints: AnchorPoint[];

    getEvent() {
        if (this.eventId === -1)
            return undefined;

        const events = this.parentAction.parentAct.events;
        return events[this.eventId];
    }

    setEvent(eventName: string) {
        if (eventName.length > 40)
            throw "Event name cannot be longer than 40 characters.";
        
        const events = this.parentAction.parentAct.events;
        const eventIndex = events.indexOf(eventName);

        if (eventIndex === -1) {
            events.push(eventName);
            this.eventId = events.length - 1;
        } else {
            this.eventId = eventIndex;
        }
    }
}