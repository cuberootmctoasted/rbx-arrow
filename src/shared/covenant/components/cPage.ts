import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputPlay, CLoaded, CPage, IdPlayer } from "./_list";
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

        useComponentChange(updateId, CLoaded, true);
        useComponentChange(updateId, CInputPlay, false);
        const loaded = covenant.worldGet(entity, CLoaded);
        const inputStart = covenant.worldGet(entity, CInputPlay);

        if (!loaded) {
            return "preload";
        }

        if (lastState === "preload" && (inputStart === undefined || inputStart <= 0)) {
            return "start";
        }

        return "playing";
    },
});
