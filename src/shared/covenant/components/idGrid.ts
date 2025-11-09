import { CollectionService, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CModel, IdGrid } from "./_list";

covenant.defineIdentity({
    identityComponent: IdGrid,
    replicated: true,
    recipe: (entities, updateId, { useEvent, useChange }) => {
        if (!RunService.IsServer()) return;

        const statesToCreate = useEvent(
            updateId,
            CollectionService,
            CollectionService.GetInstanceAddedSignal("Grid"),
        )
            .filter(([instance]) => instance.IsA("PVInstance"))
            .map(([instance]) => {
                return { data: instance as PVInstance };
            });

        const statesToDelete = useEvent(
            updateId,
            CollectionService,
            CollectionService.GetInstanceRemovedSignal("Grid"),
        )
            .filter(([instance]) => instance.IsA("PVInstance"))
            .map(([instance]) => {
                return { data: instance as PVInstance };
            });

        if (useChange(updateId, [], "Once")) {
            CollectionService.GetTagged("Grid")
                .filter((instance) => instance.IsA("PVInstance"))
                .forEach((instance) => {
                    statesToCreate.push({ data: instance as PVInstance });
                });
        }

        return {
            statesToCreate,
            statesToDelete,
        };
    },
});
