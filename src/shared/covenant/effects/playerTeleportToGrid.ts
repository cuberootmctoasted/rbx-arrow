import { RunService, Workspace } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInRound, CModel } from "../components/_list";

if (RunService.IsServer()) {
    const spawnLocations = Workspace.GetDescendants().filter((instance) =>
        instance.IsA("SpawnLocation"),
    );

    covenant.subscribeComponent(CInRound, (entity, state) => {
        const character = covenant.worldGet(entity, CModel);
        if (character === undefined) return;
        if (state === undefined) {
            const spawn = spawnLocations[math.random(0, spawnLocations.size() - 1)];
            if (spawn === undefined) return;
            character.PivotTo(spawn.GetPivot().add(new Vector3(0, 2, 0)));
        } else {
            const gridPv = covenant.worldGet(state.gridServerEntity, CModel);
            if (gridPv === undefined) return;
            character.PivotTo(gridPv.GetPivot().add(new Vector3(0, 2, 0)));
        }
    });
}
