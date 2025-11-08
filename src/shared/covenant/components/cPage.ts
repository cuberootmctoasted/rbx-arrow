import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputs, CPage, IdPlayer } from "./_list";

covenant.defineComponent({
    component: CPage,
    queriedComponents: [[IdPlayer, CInputs]],
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

        // where logic for the pages happen

        return "placeholder";
    },
});
