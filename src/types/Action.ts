import { ActFile } from "./ActFile";
import { Frame } from "./Frame";

export class Action {
    parentAct: ActFile;
    frames: Frame[];
}