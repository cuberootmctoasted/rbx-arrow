import { Players, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputGoToIsland, CInputGoToLobby, CInputPlay, IdPlayer } from "./_list";
import { clientState } from "shared/clientState";

covenant.defineComponent({
    component: CInputPlay,
    queriedComponents: [[IdPlayer]],
    replicated: false,
    predictionValidator: () => true,
    recipe: (entity, lastState, updateId, { useChange, useEvent }) => {
        if (!RunService.IsClient()) return lastState;
        if (covenant.worldGet(entity, IdPlayer) !== Players.LocalPlayer) return lastState;
        useEvent(updateId, RunService, RunService.Heartbeat);
        if (!useChange(updateId, [clientState.inputs.play], "")) return lastState;
        return clientState.inputs.play;
    },
});
