import { readFile, writeFile } from "fs/promises";
import { parseActFile } from "../parser/reader";
import { Action } from "./Action";
import { writeActFile } from "../parser/writer";

export class ActFile {
    header: string;
    version: number;
    actions: Action[];
    events: string[];
    intervals: number[];

    static fromBuffer(buffer: Buffer) {
        return parseActFile(buffer);
    }

    static async fromFile(filePath: string) {
        const file = await readFile(filePath);
        return ActFile.fromBuffer(file);
    }

    toBuffer() {
        return writeActFile(this);
    }

    toFile(filePath: string) {
        const buffer = this.toBuffer();
        return writeFile(filePath, buffer);
    }
}