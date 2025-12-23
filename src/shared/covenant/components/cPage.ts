import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputStart, CLoaded, CPage, IdPlayer } from "./_list";
import { clientState } from "shared/clientState";

covenant.defineComponent({
    component: CPage,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (
        entity,
        lastState,
        updateId,
        { useEvent, useComponentChange, useInterval, useImperative },
    ) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        useComponentChange(updateId, CLoaded);
        useComponentChange(updateId, CInputStart);
        const loaded = covenant.worldGet(entity, CLoaded);
        const inputStart = covenant.worldGet(entity, CInputStart);

        if (!loaded) {
            return "preload";
        }

        if (lastState === "start" && inputStart !== undefined && inputStart > 0) {
            return "playing";
        }

        return "start";
    },
});
