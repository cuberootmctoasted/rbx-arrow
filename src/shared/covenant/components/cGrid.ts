import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, IdGrid, IdPlayer } from "./_list";
import { Entity } from "@rbxts/covenant";

covenant.defineComponent({
    component: CGrid,
    queriedComponents: [[IdGrid]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        let owner: Entity | undefined = undefined;
        for (const [playerEntity] of covenant.worldQuery(IdPlayer)) {
            owner = playerEntity;
        }

        useComponentChange(updateId, IdPlayer).forEach(({ entity, state }) => {
            if (state === undefined) return;
            owner = entity;
        });

        return {
            owner: owner,
            size: new Vector2(100, 100),
        };
    },
});
