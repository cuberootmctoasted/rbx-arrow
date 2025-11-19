import { RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { IdRoundSystem } from "./_list";

covenant.defineIdentity({
    identityComponent: IdRoundSystem,
    replicated: true,
    lifetime: () => {
        return undefined;
    },
    factory: (spawnEntity) => {
        if (!RunService.IsServer()) return;
        spawnEntity(true);
    },
});
