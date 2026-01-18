import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CModel, COwnedByGrid, COwnedGrid, IdGrid, IdPlayer } from "./_list";
import { Entity, InferComponent } from "@rbxts/covenant";

covenant.defineComponent({
    component: COwnedByGrid,
    queriedComponents: [[IdGrid]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange, useImperative }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        const takenPlayers = useImperative(
            updateId,
            () => {
                return { value: new Set<Player>() };
            },
            [],
            "TakenPlayers",
        );

        let newState: InferComponent<typeof COwnedByGrid> | undefined = lastState;

        useComponentChange(updateId, IdPlayer, true).forEach(
            ({ entity: playerEntity, state: player, previousState: previousPlayer }) => {
                if (player === undefined && previousPlayer !== undefined) {
                    if (playerEntity === newState?.ownerServerEntity) {
                        takenPlayers.delete(previousPlayer);
                        newState = undefined;
                    }
                } else if (player !== undefined && !takenPlayers.has(player)) {
                    if (newState?.ownerServerEntity === undefined) {
                        takenPlayers.add(player);
                        newState = { ownerServerEntity: playerEntity };
                    }
                }
            },
        );

        return newState;
    },
});
