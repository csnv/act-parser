import { ActFile } from "../types/ActFile";
import { Action } from "../types/Action";
import { AnchorPoint } from "../types/AnchorPoint";
import { Frame } from "../types/Frame";
import { Layer } from "../types/Layer";
import { Read } from "./types";

/* offset counter */
let offset = 0;
/* version of act file */
let version = 0;

/**
 * Reads ${size} bytes from ${buffer} with the method specified in ${functionKey}
 * This is only a shortcut for Buffer methods and it's handy to somehow keep track of offset automatically
 * 
 * @param buffer File buffer
 * @param functionKey Type of data being read
 * @param size Size of data
 * @returns Read data
 */
function read(buffer: Buffer, functionKey: string, size: number) {
    const func = buffer[functionKey];

    const data = functionKey === Read.String ?
        buffer.toString("utf-8", offset, offset + size) :
        func.apply(buffer, [offset]);
    
    offset += size;
    return data;
}

/**
 * Reads an Act File from a file buffer.
 * Versions currently supported: 0x200, 0x201, 0x202, 0x203, 0x204, 0x205
 * 
 * @param buffer File buffer
 * @returns Act File object
 */
export function parseActFile(buffer: Buffer): ActFile {
    const actFile = new ActFile();
    offset = 0;
    version = 0;

    actFile.header = read(buffer, Read.String, 2);
    actFile.version = version = read(buffer, Read.UInt16, 2);
    const numActions = read(buffer, Read.UInt16, 2);

    offset += 10; // Reserved

    actFile.actions = [];

    try {
        // Dynamic list of actions
        for (let i = 0; i < numActions; i++) {
            actFile.actions.push(parseAction(buffer, actFile));
        }

        actFile.events = [];

        if (version >= 0x201) {
            // Dynamic list of event names
            // Each event name has a max length of 40
            const numEvents = read(buffer, Read.UInt32, 4);

            for (let i = 0; i < numEvents; i++) {
                const eventName = read(buffer, Read.String, 40).replaceAll('\x00', '');
                actFile.events.push(eventName);
            }
        }
        
        // Intervals list, one for each action
        // Intervals are float numbers that must be multiplied by 25
        // to get the time in milliseconds
        // Default value is 6
        actFile.intervals = [];
        for (let i = 0; i < numActions; i++) {
            if (version >= 0x202)
                actFile.intervals.push(read(buffer, Read.Float, 4) * 25);
            else
                actFile.intervals.push(6 * 25);
        }

    } catch(e) {
        throw ("Error on version: " + version.toString(16));
    }

    return actFile;
}

/**
 * Reads an action from file
 * Actions merely contain a list of frames
 * 
 * @param buffer File buffer
 * @param parentAct Parent act file object
 * @returns Action object
 */
function parseAction(buffer: Buffer, parentAct: ActFile): Action {
    const action = new Action();
    action.parentAct = parentAct;

    const numFrames = read(buffer, Read.UInt32, 4);
    action.frames = [];
    
    // Dynamic list of frames
    for (let i = 0; i < numFrames; i++) {
        action.frames.push(parseFrame(buffer, action));
    }

    return action;
}

/**
 * Reads a frame from file
 * 
 * @param buffer File buffer
 * @param parentAction Parent action object
 * @returns Frame object
 */
function parseFrame(buffer: Buffer, parentAction: Action): Frame {
    const frame = new Frame();
    frame.parentAction = parentAction;

    frame.range1 = [
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
    ];

    frame.range2 = [
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
        read(buffer, Read.UInt32, 4),
    ];

    const numLayers = read(buffer, Read.UInt32, 4);

    // Dynamic list of layers
    frame.layers = [];
    for (let i = 0; i < numLayers; i++)
        frame.layers.push(parseLayer(buffer, frame));

    // Event names are stored at the act file level
    // This ID is the index of an event in such list
    frame.eventId = -1;
    if (version >= 0x200)
        frame.eventId = read(buffer, Read.Int32, 4);

    // Dynamic list of anchor points
    frame.anchorPoints = [];
    if (version >= 0x203) {
        const numAnchorPoints = read(buffer, Read.UInt32, 4);

        for (let i = 0; i < numAnchorPoints; i++)
            frame.anchorPoints.push(parseAnchorPoint(buffer, frame));
    }

    return frame;
}

/**
 * Reads a layer from frame
 * 
 * @param buffer File buffer
 * @param parentFrame Parent frame object
 * @returns Layer object
 */
function parseLayer(buffer: Buffer, parentFrame: Frame): Layer {
    const layer = new Layer();
    layer.parentFrame = parentFrame;

    layer.x = read(buffer, Read.Int32, 4);
    layer.y = read(buffer, Read.Int32, 4);
    layer.sprId = read(buffer, Read.Int32, 4);
    layer.flags = read(buffer, Read.Int32, 4);

    layer.color = [ // RGBA
        read(buffer, Read.UInt8, 1),
        read(buffer, Read.UInt8, 1),
        read(buffer, Read.UInt8, 1),
        read(buffer, Read.UInt8, 1)
    ];

    layer.xScale = read(buffer, Read.Float, 4);

    layer.yScale = layer.xScale;
    if (version >= 0x204)
        layer.yScale = read(buffer, Read.Float, 4);

    layer.rotation = read(buffer, Read.Float, 4);
    layer.sprType = read(buffer, Read.Int32, 4);

    // TODO: Should lower versions read this from sprites?
    layer.width = 0;
    layer.height = 0;
    if (version >= 0x205) {
        layer.width = read(buffer, Read.Int32, 4);
        layer.height = read(buffer, Read.Int32, 4);
    }

    return layer;
}

/**
 * Reads a Anchor Point from frame
 * 
 * @param buffer File buffer
 * @param parentFrame Parent frame object
 * @returns Anchor Point object
 */
function parseAnchorPoint(buffer: Buffer, parentFrame: Frame): AnchorPoint {
    const anchorPoint = new AnchorPoint();
    anchorPoint.parentFrame = parentFrame;
    offset += 4; // Unknown/reserved

    anchorPoint.x = read(buffer, Read.Int32, 4);
    anchorPoint.y = read(buffer, Read.Int32, 4);
    anchorPoint.attr = read(buffer, Read.Int32, 4);

    return anchorPoint;
}