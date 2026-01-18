import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CGridRound, CInRound, COwnedByGrid, COwnedGrid, IdPlayer } from "./_list";

covenant.defineComponent({
    component: COwnedGrid,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        const gridChanges = useComponentChange(updateId, COwnedByGrid, true).filter(({ state }) => {
            return state?.ownerServerEntity === entity;
        });

        if (!gridChanges.isEmpty()) {
            const { entity, state, previousState } = gridChanges[0]!;
            if (state !== undefined) {
                return { gridServerEntity: entity };
            } else if (previousState !== undefined) {
                return undefined;
            }
        }

        return lastState;
    },
});
