import { FlexInput } from "shared/flexInputs";

export interface Keybinds {
    readonly forward: FlexInput;
    readonly backward: FlexInput;
    readonly left: FlexInput;
    readonly right: FlexInput;
    readonly jump: FlexInput;
}

export const defaultKeybinds: Keybinds = {
    forward: "w",
    backward: "s",
    left: "a",
    right: "d",
    jump: "spc",
};
