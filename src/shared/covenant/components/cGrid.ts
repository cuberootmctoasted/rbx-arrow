import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CModel, IdGrid, IdPlayer } from "./_list";
import { getPvPrimaryPart } from "shared/utils/pvUtils";
import { trackComponent } from "shared/utils/trackComponent";

trackComponent(CGrid);

covenant.defineComponent({
    component: CGrid,
    queriedComponents: [[IdGrid, CModel]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange, useImperative }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        // TODO: most likely the replication accidentally removed the state
        const model = covenant.worldGet(entity, CModel)!;
        const part = getPvPrimaryPart(model);

        return {
            size: part
                ? new Vector2(part.ExtentsSize.X, part.ExtentsSize.Z)
                : new Vector2(100, 100),
        };
    },
});
