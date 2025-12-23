import { RunService, Workspace } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CModel, CPlace } from "../components/_list";
import { Entity } from "@rbxts/covenant";

if (RunService.IsServer()) {
    const spawnLocations = Workspace.GetDescendants().filter((instance) =>
        instance.IsA("SpawnLocation"),
    );

    covenant.subscribeComponent(CPlace, (entity, state) => {
        const character = covenant.worldGet(entity, CModel);
        if (character === undefined) return;
        if (state === "lobby") {
            const spawn = spawnLocations[math.random(0, spawnLocations.size() - 1)];
            if (spawn === undefined) return;
            character.PivotTo(spawn.GetPivot().add(new Vector3(0, 2, 0)));
        } else {
            let grid: Entity | undefined = undefined;
            for (const [e, cGrid] of covenant.worldQuery(CGrid)) {
                if (cGrid.ownerServerEntity === entity) {
                    grid = e;
                    break;
                }
            }
            if (grid === undefined) return;
            const gridPv = covenant.worldGet(grid, CModel);
            if (gridPv === undefined) return;
            character.PivotTo(gridPv.GetPivot().add(new Vector3(0, 2, 0)));
        }
    });
}
