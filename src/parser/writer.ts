import { ActFile } from "../types/ActFile";
import { Action } from "../types/Action";
import { AnchorPoint } from "../types/AnchorPoint";
import { Frame } from "../types/Frame";
import { Layer } from "../types/Layer";
import { Write } from "./types";

/* offset counter */
let offset: number;
/* Buffer reference that we're going to change a lot */
/* Any tips? */
let buffer: Buffer;

/**
 * Writes ${data} into ${buffer} with the method specified in ${functionKey}
 * This method assumes there's enough allocated space already
 * ${size} is only used for keeping track of offset automatically
 * 
 * @param functionKey Method to use for writing
 * @param size Size of data being written (only used for offset)
 * @param data Data being written
 */
function write(functionKey: string, size: number, data: any) {
    const func = buffer[functionKey];

    functionKey === Write.String ?
        buffer.write(data, offset, 'utf-8') :
        func.apply(buffer, [data, offset]);
    
    offset += size;
}

/**
 * Allocates additional space in buffer
 * Basically creates a new buffer and copies the old one in it
 * 
 * @param size Size of additional buffer, in bytes
 */
function enlarge(size: number) {
    const enlarged = Buffer.alloc(buffer.length + size);
    buffer.copy(enlarged);
    buffer = enlarged;
}

/**
 * Writes an act object into a 0x205 act file buffer
 * 
 * @param actFile Act object being exported to file
 * @returns File buffer
 */
export function writeActFile(actFile: ActFile): Buffer {
    offset = 0;
    buffer = Buffer.alloc(2 + 2 + 2 + 10);

    write(Write.String, 2, 'AC'); // Header
    write(Write.UInt16, 2, 0x205); // Version
    write(Write.UInt16, 2, actFile.actions.length); // numActions

    offset += 10; // Reserved

    for (let action of actFile.actions)
        writeAction(action); // each action

    enlarge( 
        4 + // num events
        40 * actFile.events.length + // events
        4 * actFile.intervals.length // intervals
    );

    write(Write.UInt32, 4, actFile.events.length);
    actFile.events.forEach(event => write(Write.String, 40, event));
    actFile.intervals.forEach(interval => write(Write.Float, 4, interval / 25));

    return buffer;
}

/**
 * Writes action object into buffer
 * 
 * @param action Action object
 */
function writeAction(action: Action) {
    enlarge(4); // Num frames
    write(Write.UInt32, 4, action.frames.length);

    for (let frame of action.frames)
        writeFrame(frame);
}

/**
 * Writes frame object into buffer
 * 
 * @param frame Frame object
 */
function writeFrame(frame: Frame) {
    enlarge(
        4 * 4 + // range 1
        4 * 4 + // range 2
        4 // num layers
    );
    
    frame.range1.forEach(range => write(Write.UInt32, 4, range));
    frame.range2.forEach(range => write(Write.UInt32, 4, range));

    write(Write.UInt32, 4, frame.layers.length);
    frame.layers.forEach(layer => writeLayer(layer));

    enlarge(
        4 + // event id
        4   // num anchor points
    );

    write(Write.Int32, 4, frame.eventId);

    write(Write.UInt32, 4, frame.anchorPoints.length);
    frame.anchorPoints.forEach(anchorPoint => writeAnchorPoint(anchorPoint));
}

/**
 * Writes layer object into buffer
 * 
 * @param layer Layer object
 */
function writeLayer(layer: Layer) {
    enlarge(
        4 + // x
        4 + // y
        4 + // sprId
        4 + // flags
        4 + // color
        4 + // xScale
        4 + // yScale
        4 + // rotation
        4 + // sprType
        4 + // width
        4   // height
    );

    write(Write.Int32, 4, layer.x);
    write(Write.Int32, 4, layer.y);
    write(Write.Int32, 4, layer.sprId);
    write(Write.Int32, 4, layer.flags);
    layer.color.forEach(color => write(Write.UInt8, 1, color));
    write(Write.Float, 4, layer.xScale);
    write(Write.Float, 4, layer.yScale);
    write(Write.Float, 4, layer.rotation);
    write(Write.Int32, 4, layer.sprType);
    write(Write.Int32, 4, layer.width);
    write(Write.Int32, 4, layer.height);
}

/**
 * Writes Anchor Point object into buffer
 * 
 * @param anchorPoint AnchorPoint object
 */
function writeAnchorPoint(anchorPoint: AnchorPoint) {
    enlarge(
        4 + // Unknown
        4 + // x
        4 + // y
        4 // attr
    );

    offset += 4;
    write(Write.Int32, 4, anchorPoint.x);
    write(Write.Int32, 4, anchorPoint.y);
    write(Write.Int32, 4, anchorPoint.attr);
}