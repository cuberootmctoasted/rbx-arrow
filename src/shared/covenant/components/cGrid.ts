import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CModel, IdGrid, IdPlayer } from "./_list";
import { Entity, InferComponent } from "@rbxts/covenant";
import { getPvPrimaryPart } from "shared/utils/pvUtils";
import Immut from "@rbxts/immut";
import { trackComponent } from "shared/utils/trackComponent";

//trackComponent(CGrid, "CGrid");

covenant.defineComponent({
    component: CGrid,
    queriedComponents: [[IdGrid, CModel]],
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

        const model = covenant.worldGet(entity, CModel)!;
        const part = getPvPrimaryPart(model);

        let newState: InferComponent<typeof CGrid> = lastState ?? {
            size: part
                ? new Vector2(part.ExtentsSize.X, part.ExtentsSize.Z)
                : new Vector2(100, 100),
        };

        useComponentChange(updateId, IdPlayer).forEach(
            ({ entity: playerEntity, state, previousState }) => {
                if (state === undefined && previousState !== undefined) {
                    if (playerEntity === newState.ownerServerEntity) {
                        takenPlayers.delete(previousState);
                        newState = Immut.produce(newState, (draft) => {
                            draft.ownerServerEntity = undefined;
                        });
                    }
                } else if (state !== undefined && !takenPlayers.has(state)) {
                    if (newState.ownerServerEntity === undefined) {
                        newState = Immut.produce(newState, (draft) => {
                            takenPlayers.add(state);
                            draft.ownerServerEntity = playerEntity;
                        });
                    }
                }
            },
        );

        return newState;
    },
});
