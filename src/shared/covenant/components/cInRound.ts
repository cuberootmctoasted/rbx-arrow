import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInRound, CRoundSystem, CWillPlay, IdGrid, IdPlayer } from "./_list";
import { Entity } from "@rbxts/covenant";

//trackComponent(CInRound, "InRound");

covenant.defineComponent({
    component: CInRound,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange, useImperative }) => {
        if (!RunService.IsServer()) return lastState;
        const roundSystems = useComponentChange(updateId, CRoundSystem);
        const roundSystem = !roundSystems.isEmpty() ? roundSystems[0].state : undefined;
        if (roundSystem === undefined) return undefined;
        const usedGrids = useImperative(
            updateId,
            () => {
                return { value: new Set<string>() };
            },
            [],
            "Grids",
        );
        const willPlay = covenant.worldGet(entity, CWillPlay);
        if (roundSystem.loadingRound && willPlay) {
            let grid: Entity | undefined = undefined;
            for (const [gridEntity] of covenant.worldQuery(IdGrid)) {
                if (usedGrids.has(tostring(gridEntity))) continue;
                grid = gridEntity;
                break;
            }
            if (grid === undefined) return undefined;
            usedGrids.add(tostring(grid));
            return {
                gridServerEntity: grid,
            };
        }
        if (roundSystem.loadingIntermission || roundSystem.intermissionEnd !== undefined) {
            usedGrids.clear();
            return undefined;
        }
        return lastState;
    },
});
