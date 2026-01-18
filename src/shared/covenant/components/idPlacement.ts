import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGridRound, CInputPlace, CInventory, COwnedByGrid, IdPlacement } from "./_list";
import { Entity } from "@rbxts/covenant";
import { trackComponent } from "shared/utils/trackComponent";

covenant.subscribeComponent(IdPlacement, (entity, state, prev, isdeleteing) => {
    print(entity);
    print(isdeleteing);
});

covenant.defineIdentity({
    identityComponent: IdPlacement,
    replicated: true,
    lifetime: (entity, state, despawn) => {
        const unsubscribe = covenant.subscribeComponent(
            CGridRound,
            (gridEntity, gridState, gridPreviousState) => {
                if (
                    gridState === undefined &&
                    gridPreviousState !== undefined &&
                    gridEntity === state.gridServerEntity
                ) {
                    print("despawn");
                    despawn();
                }
            },
        );
        return () => {
            unsubscribe();
        };
    },
    factory: (spawnEntity) => {
        if (!RunService.IsServer()) return;

        const ownerGridMap: Map<string, Entity> = new Map();
        covenant.subscribeComponent(COwnedByGrid, (entity, state, previousState) => {
            if (state === undefined) {
                if (previousState?.ownerServerEntity !== undefined) {
                    ownerGridMap.delete(tostring(previousState.ownerServerEntity));
                }
                return;
            }
            if (state.ownerServerEntity === undefined) return;
            ownerGridMap.set(tostring(state.ownerServerEntity), entity);
        });

        covenant.subscribeComponent(CInputPlace, (entity, state) => {
            if (state === undefined) return;
            const inventory = covenant.worldGet(entity, CInventory);
            if (inventory === undefined) return;
            const itemName = inventory.get(state.guid);
            if (itemName === undefined) return;
            const grid = ownerGridMap.get(tostring(entity));
            if (grid === undefined) return;
            spawnEntity({
                itemName: itemName,
                position: state.position,
                gridServerEntity: grid,
            });
        });
    },
});
