import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CLoaded, CWillPlay, IdPlayer } from "./_list";
import { trackComponent } from "shared/utils/trackComponent";

//trackComponent(CWillPlay, "WillPlay");

covenant.defineComponent({
    component: CWillPlay,
    queriedComponents: [[IdPlayer, CLoaded]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState) => {
        if (!RunService.IsServer()) return lastState;
        return true;
    },
});
