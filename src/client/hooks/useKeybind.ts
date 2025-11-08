import { defaultKeybinds, Keybinds } from "shared/covenant/keybinds";
import { usePlayerEntity } from "./usePlayerEntity";
import { useComponent } from "./useComponent";
import { CPlayerSave } from "shared/covenant/components/_list";
import { useFlexInput } from "./useFlexInput";

export function useKeybind(keybind: keyof Keybinds) {
    const playerEntity = usePlayerEntity();
    const playerSave = useComponent(playerEntity, CPlayerSave);
    return useFlexInput((playerSave?.keybinds ?? defaultKeybinds)[keybind]);
}
