import { defaultKeybinds, Keybinds } from "./keybinds";

export interface PlayerSave {
    keybinds: Keybinds;
}

// where the definition of the player save is at
export const defaultPlayerSave: PlayerSave = {
    keybinds: defaultKeybinds,
};
