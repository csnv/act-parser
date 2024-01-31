import { Frame } from "./Frame";

export class Layer {
    parentFrame: Frame; // Reference to parent frame
    x: number; // The x coordinate of the layer.
    y: number; // The y coordinate of the layer.
    sprId: number;  // The sprite number used (this references the sprite inside a SPR file).
    flags: number; // Bitflags. So far only first bit is used to indicate whether the layer should be mirrored on the y-Axis.
    color: number[]; // In the order: red, green, blue, alpha. Each color is one byte. This is the tint of this layer.
    xScale: number; // The scale factor for the width of the layer. Below version 0x204 this is also the scale factor for the height (yScale).
    yScale: number; // The scale factor for the height of the layer.
    rotation: number; // The rotation of the layer around its center in angle degrees.
    sprType: number; // The type of the sprite used from SPR. 0 == Palette sprite, 1 == RGBA sprite.
    width: number; // The width of the layer. Assumingly always the same as the referenced sprite width in the SPR file.
    height: number; // The height of the layer. Assumingly always the same as the referenced sprite height in the SPR file.
}