import { Players, RunService } from "@rbxts/services";
import { covenant } from "..";
import { IdPlayer } from "./_list";

covenant.defineIdentity({
    identityComponent: IdPlayer,
    replicated: true,
    lifetime: (entity, player, despawn) => {
        const connection = Players.PlayerRemoving.Connect((plr) => {
            if (player !== plr) return;
            despawn();
        });
        return () => {
            connection.Disconnect();
        };
    },
    factory: (spawnEntity) => {
        if (!RunService.IsServer()) return;

        Players.PlayerAdded.Connect((player) => {
            spawnEntity(player);
        });
    },
});
