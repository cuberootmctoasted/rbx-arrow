import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputs, CLoaded, IdPlayer } from "./_list";
import { trackComponent } from "shared/utils/trackComponent";

//trackComponent(CLoaded, "Loaded");

covenant.defineComponent({
    component: CLoaded,
    queriedComponents: [[IdPlayer, CInputs]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState) => {
        if (!RunService.IsServer()) return lastState;
        if (lastState !== undefined) return lastState;
        const inputs = covenant.worldGet(entity, CInputs);
        if (inputs?.preloaded) return true;
    },
});
