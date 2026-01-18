import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CGridRound, CInRound, COwnedGrid, IdPlayer } from "./_list";

covenant.defineComponent({
    component: CInRound,
    queriedComponents: [[IdPlayer]],
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

        useComponentChange(entity, COwnedGrid, false);
        const cOwnedGrid = covenant.worldGet(entity, COwnedGrid);

        const gridRoundChanges = useComponentChange(updateId, CGridRound, true).filter(
            ({ entity: gridEntity }) => gridEntity === cOwnedGrid?.gridServerEntity,
        );

        if (!gridRoundChanges.isEmpty()) {
            const { entity, state, previousState } = gridRoundChanges[0]!;
            if (state !== undefined) {
                return { gridServerEntity: entity };
            } else if (previousState !== undefined) {
                return undefined;
            }
        }

        return lastState;
    },
});
