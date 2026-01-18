import { CollectionService, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { IdGrid } from "./_list";

covenant.defineIdentity({
    identityComponent: IdGrid,
    replicated: true,
    lifetime: (entity, state, despawn) => {
        const instance = state.data;
        if (instance === undefined) return;
        const connection = CollectionService.GetInstanceRemovedSignal("Grid").Connect((inst) => {
            if (instance !== inst) return;
            despawn();
        });
        return () => {
            connection.Disconnect();
        };
    },
    factory: (spawnEntity) => {
        if (!RunService.IsServer()) return;

        CollectionService.GetInstanceAddedSignal("Grid").Connect((instance) => {
            if (!instance.IsA("PVInstance")) return;
            spawnEntity({ data: instance });
        });

        CollectionService.GetTagged("Grid")
            .filter((instance) => instance.IsA("PVInstance"))
            .forEach((instance) => {
                spawnEntity({ data: instance });
            });
    },
});
