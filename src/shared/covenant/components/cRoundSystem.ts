import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CRoundSystem, IdRoundSystem } from "./_list";
import { syncedTime } from "shared/utils/syncedTime";

const INTERMISSION_TIME = 10;
const ROUND_TIME = 10;

//trackComponent(CRoundSystem, "RoundSystem");

covenant.defineComponent({
    component: CRoundSystem,
    queriedComponents: [[IdRoundSystem]],
    replicated: true,
    predictionValidator: false,
    recipe: (
        entity,
        lastState,
        updateId,
        { useEvent, useComponentChange, useInterval, useImperative, useAsync },
    ) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        useEvent(updateId, RunService, RunService.Heartbeat);

        const completeLoadingIntermission = useAsync(
            updateId,
            () => {
                if (!lastState?.loadingIntermission) return false;
                task.wait(2);
                return true;
            },
            [lastState],
            tostring(entity) + "-intermission",
        );

        const completeLoadingRound = useAsync(
            updateId,
            () => {
                if (!lastState?.loadingRound) return false;
                task.wait(2);
                return true;
            },
            [lastState],
            tostring(entity) + "-round",
        );

        if (lastState === undefined) {
            return {
                intermissionEnd: syncedTime() + INTERMISSION_TIME,
            };
        }

        if (
            lastState.loadingIntermission &&
            completeLoadingIntermission.completed &&
            completeLoadingIntermission.value
        ) {
            return {
                intermissionEnd: syncedTime() + INTERMISSION_TIME,
            };
        }

        if (
            lastState.loadingRound &&
            completeLoadingRound.completed &&
            completeLoadingRound.value
        ) {
            return {
                roundEnd: syncedTime() + ROUND_TIME,
            };
        }

        if (lastState.intermissionEnd !== undefined && syncedTime() >= lastState.intermissionEnd) {
            return {
                loadingRound: true,
            };
        }

        if (lastState.roundEnd !== undefined && syncedTime() >= lastState.roundEnd) {
            return {
                loadingIntermission: true,
            };
        }

        return lastState;
    },
});
