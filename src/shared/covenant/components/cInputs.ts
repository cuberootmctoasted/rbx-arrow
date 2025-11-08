import { Players, RunService } from "@rbxts/services";
import { covenant } from "..";
import { getInputs } from "shared/inputs";
import { CInputs, IdPlayer } from "./_list";

covenant.defineComponent({
    component: CInputs,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: () => true,
    recipe: (entity, lastState, updateId, { useEvent, useChange }) => {
        if (!RunService.IsClient() || covenant.worldGet(entity, IdPlayer) !== Players.LocalPlayer) {
            return lastState;
        }

        useEvent(updateId, RunService, RunService.Heartbeat);

        const newState = getInputs();

        if (!useChange(updateId, [newState], "Inpts")) return lastState;

        return newState;
    },
});
