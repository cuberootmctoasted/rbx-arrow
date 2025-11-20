import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CLoaded, CPage, IdPlayer } from "./_list";

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
        const loaded = covenant.worldGet(entity, CLoaded);

        if (!loaded) {
            return "preload";
        }

        return "playing";
    },
});
