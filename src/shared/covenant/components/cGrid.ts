import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CInRound, CModel, IdGrid, IdPlayer } from "./_list";
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
    recipe: (entity, lastState, updateId, { useComponentChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        const model = covenant.worldGet(entity, CModel)!;
        const part = getPvPrimaryPart(model);

        let newState: InferComponent<typeof CGrid> = lastState ?? {
            size: part
                ? new Vector2(part.ExtentsSize.X, part.ExtentsSize.Z)
                : new Vector2(100, 100),
        };

        useComponentChange(updateId, CInRound).forEach(
            ({ entity: playerEntity, state, previousState }) => {
                if (
                    state === undefined &&
                    previousState !== undefined &&
                    previousState.gridServerEntity === entity
                ) {
                    newState = Immut.produce(newState, (draft) => {
                        draft.ownerServerEntity = undefined;
                    });
                } else if (state !== undefined && state.gridServerEntity === entity) {
                    newState = Immut.produce(newState, (draft) => {
                        draft.ownerServerEntity = playerEntity;
                    });
                }
            },
        );

        return newState;
    },
});
