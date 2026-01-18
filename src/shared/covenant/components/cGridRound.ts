import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CGridRound, CInputStartRound, COwnedByGrid, IdPlacement, IdPlayer } from "./_list";
import { syncedTime } from "shared/utils/syncedTime";

covenant.defineComponent({
    component: CGridRound,
    queriedComponents: [[CGrid]],
    replicated: true,
    predictionValidator: false,
    recipe: (
        entity,
        lastState,
        updateId,
        { useEvent, useComponentChange, useInterval, useImperative, useChange },
    ) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        const cOwnedByGrid = covenant.worldGet(entity, COwnedByGrid);
        const inputStartRoundChanges = useComponentChange(updateId, CInputStartRound, true);
        useEvent(updateId, RunService, RunService.Heartbeat);

        if (lastState !== undefined) {
            if (lastState.endTime > syncedTime()) {
                return lastState;
            } else {
                return undefined;
            }
        }

        if (
            !inputStartRoundChanges
                .filter(
                    ({ entity: playerEntity, state }) =>
                        cOwnedByGrid?.ownerServerEntity === playerEntity &&
                        state !== undefined &&
                        state > 0,
                )
                .isEmpty()
        ) {
            return { endTime: syncedTime() + 5 };
        }
    },
});
