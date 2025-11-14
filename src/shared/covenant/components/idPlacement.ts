import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CGrid, CInputs, CInventory, IdGrid, IdPlacement } from "./_list";
import { Entity, InferComponent } from "@rbxts/covenant";

covenant.subscribeComponent(IdPlacement, (entity, state) => {
    print(state);
});

covenant.defineIdentity({
    identityComponent: IdPlacement,
    replicated: true,
    recipe: (entities, updateId, { useComponentChange, useImperative }) => {
        if (!RunService.IsServer()) return;

        const statesToCreate: InferComponent<typeof IdPlacement>[] = [];

        const ownerGridMap = useImperative(
            updateId,
            () => {
                const map: Map<string, Entity> = new Map();
                const unsubscribe = covenant.subscribeComponent(
                    CGrid,
                    (entity, state, previousState) => {
                        if (state === undefined) {
                            if (previousState?.owner !== undefined) {
                                map.delete(tostring(previousState.owner));
                            }
                            return;
                        }
                        if (state.owner === undefined) return;
                        map.set(tostring(state.owner), entity);
                    },
                );
                return {
                    value: map,
                    cleanup: () => {
                        unsubscribe();
                    },
                };
            },
            [],
            "OwnerGrid",
        );

        useComponentChange(updateId, CInputs).forEach(({ entity, state }) => {
            if (state?.place === undefined) return;
            const inventory = covenant.worldGet(entity, CInventory);
            if (inventory === undefined) return;
            const itemName = inventory.get(state.place.guid);
            if (itemName === undefined) return;
            const grid = ownerGridMap.get(tostring(entity));
            if (grid === undefined) return;
            statesToCreate.push({ itemName: itemName, position: state.place.position, grid: grid });
        });

        return { statesToCreate };
    },
});
