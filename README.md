# Act Parser

Library for parsing and writing Act files in NodeJS.

## Getting started

### Prerequisites
- Install [Node.js] which includes [Node Package Manager][npm]

### Installation

Install act-parser directly from NPM
> npm install @csnvrag/act-parser

Or from Github

> npm install https://github.com/csnv/act-parser.git

# API Reference <a name="reference"></a>
* [ActFile](#actFile)
    * [fromFile(filepath)](#actFile.fromFile) `static async function`
    * [fromBuffer(buffer)](#actFile.fromBuffer) `static function`
    * [toFile(filepath)](#actFile.toFile) `function`
    * [toBuffer()](#actFile.toBuffer) `function`
    * [header](#actFile.header) `string`
    * [version](#actFile.version) `number`
    * [events](#actFile.events) `array`
    * [actions](#actFile.actions) `array`
    * [intervals](#actFile.intervals) `array`

* [Action](#action.0)
    * [frames](#action.frames) : `array`

* [Frame](#frame)
    * [getEvent()](#frame.getEvent) : `function`
    * [setEvent(eventName)](#frame.setEvent) : `function`
    * [range1](#frame.range1) : `array`
    * [range2](#frame.range2) : `array`
    * [eventId](#frame.eventId) : `number`
    * [layers](#frame.layers) : `array`
    * [anchorPoints](#frame.anchorPoints) : `array`

* [Layer](#layer)
    * [x](#layer.x) : `number`
    * [y](#layer.y) : `number`
    * [sprId](#layer.sprId) : `number`
    * [flags](#layer.flags) : `number`
    * [color](#layer.color) : `array`
    * [xScale](#layer.xScale) : `number`
    * [yScale](#layer.yScale) : `number`
    * [rotation](#layer.rotation) : `number`
    * [sprType](#layer.sprType) : `number`
    * [width](#layer.width) : `number`
    * [height](#layer.height) : `number`

* [AnchorPoint](#anchorPoint)
    * [x](#anchorPoint.x) : `number`
    * [y](#anchorPoint.y) : `number`
    * [attr](#anchorPoint.attr) : `number`

---
<a name="actFile"></a>

## ActFile `class`

ActFile is the top level class of this library. Along with the file information, actions, frames, events, etc can be accesed through this class.

<a name="actFile.fromFile"></a>

### fromFile(filepath) `static async function`
Reads file specified in `filepath` and returns an ActFile instance. This is the most straightforward method for reading act files.

Example:
```JS
const monsterFile = ActFile.fromFile('./monster.act');
```
<a name="actFile.fromBuffer"></a>

### fromBuffer(buffer) `static function`
Parses a `Buffer` with the contents of an .act file into an ActFile instance. In contrast to `fromFile`, this method does not read files directly.

Example:
```JS
const fileBuffer = await readFile('./monster.act');
const monsterFile = ActFile.fromBuffer(fileBuffer);
```


<a name="actFile.toFile"></a>

### toFile(filepath)() `async function`
Writes current act file into a file, specified in filepath.

Example:
```JS
await monsterFile.toFile('./monster-copy.act');
```

<a name="actFile.toBuffer"></a>

### toBuffer() `function`
Writes current act file into a buffer and returns the buffer for further processing.
Example:
```JS
const buffer = monsterFile.toBuffer();
await writeFile('./monster-copy.act', buffer);
```

<a name="actFile.header"></a>

### header `string`
Header information of the file. Must be `AC`.

<a name="actFile.version"></a>

### version `number`
Version of the file. Currently, this library supports from `0x200` to `0x205`.

**Note**: Act-parser saves files in version `0x205`.

<a name="actFile.events"></a>

### events `array`
Dynamic list of events. Each event is a string of max 40 characters.

<a name="actFile.actions"></a>

### actions `array`
Dynamic list of [Actions](#action).

<a name="actFile.intervals"></a>

### intervals `array`
Dynamic list of intervals, equal to the number of actions (one interval per action). Time in milliseconds after a certain action.

<a name="action.0"></a>

## Action `class`

Action represents each direction in a sequence of frames.

<a name="action.frames"></a>

### frames `array`
Dynamic list of [Frames](#frame)

<a name="frame"></a>

## Frame `class`

Frame object in a sequence of frames. Tightly linked with sprites.

<a name="frame.getEvent"></a>

### getEvent() `function`
Returns the name of the current frame event. `Undefined` if none associated.

<a name="frame.setEvent"></a>

### setEvent(eventName) `function`
Assigns the label in `eventName` to the frame. If such label does not exist in `ActFile.events`, it's added automatically.

<a name="frame.range1"></a>

### range1 `array`

<a name="frame.range2"></a>

### range2 `array`

<a name="frame.layers"></a>

### layers `array`
Dynamic array of [Layers](#layer)

<a name="frame.eventId"></a>

### eventId `number`
0-based index of the assigned event of frame in `ActFile.events`. `-1` if no event is assigned.

<a name="frame.anchor-points"></a>

### anchorPoints `array`
Dynamic array of [AnchorPoints](#anchorPoint)

<a name="layer"></a>

## Layer `class`

Layer representation of a sprite's bitmap.

<a name="layer.x"></a>

### x `number`
Horizontal position in frame.

<a name="layer.y"></a>

### y `number`
Vertical position in frame.

<a name="layer.sprId"></a>

### sprId `number`
ID of sprite bitmap used in layer.

<a name="layer.flags"></a>

### flags `number`
Bitflags of layer. Currently, only used for mirroring the layer on the y-axis.

<a name="layer.color"></a>

### color `array`
Tint of the layer in RGBA form: [0, 0, 0, 0] to [255, 255, 255, 255]

<a name="layer.xScale"></a>

### xScale `number`
Scale factor for width

<a name="layer.yScale"></a>

### yScale `number`
Scale factor for height

<a name="layer.rotation"></a>

### rotation `number`
Rotation of the layer around its center, in angle degrees.

<a name="layer.sprType"></a>

### sprType `number`
The type of the sprite used from SPR. 0 == Palette sprite, 1 == RGBA sprite.

<a name="layer.width"></a>

### width `number`
Width of the layer.

<a name="layer.height"></a>

### height `number`
Height of the layer.

<a name="anchorPoint"></a>

## AnchorPoint `class`

Anchor points of current frame.

<a name="anchorPoint.x"></a>

### x `number`
Horizontal position in frame.

<a name="anchorPoint.y"></a>

### y `number`
Vertical position in frame.

<a name="anchorPoint.attr"></a>

### attr `number`
Attribute reference info


[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm