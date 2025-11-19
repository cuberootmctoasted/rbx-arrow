import { Players, RunService, Workspace } from "@rbxts/services";
import { covenant } from "..";
import { Make } from "@rbxts/altmake";
import { pseudoAnchor } from "shared/utils/pvUtils";
import { IdRepFocus, RepFocusData } from "./_list";

covenant.defineIdentity({
    identityComponent: IdRepFocus,
    replicated: true,
    lifetime: (entity, state, despawn) => {
        const connection = Players.PlayerRemoving.Connect((player) => {
            if (state.player !== state.player) return;
            state.part?.Destroy();
            despawn();
        });
        return () => {
            connection.Disconnect();
        };
    },
    factory: (spawnEntity) => {
        if (!RunService.IsServer()) return;

        function sp(player: Player) {
            const part = Make("Part", {
                Name: "RepFocus-" + player.Name,
                Size: new Vector3(1, 1, 1),
                Position: new Vector3(0, 100, 0),
                Parent: Workspace,
                Transparency: 1,
                CanCollide: false,
                Anchored: false,
                CanTouch: false,
                CanQuery: false,
            });
            pseudoAnchor(part, true);
            part.SetNetworkOwner(player);
            player.ReplicationFocus = part;
            spawnEntity({ player, part });
        }

        Players.PlayerAdded.Connect((player) => {
            sp(player);
        });

        Players.GetPlayers().forEach((player) => {
            sp(player);
        });
    },
});
