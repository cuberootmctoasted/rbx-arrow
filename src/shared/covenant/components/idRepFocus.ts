import { Players, RunService, Workspace } from "@rbxts/services";
import { covenant } from "..";
import { Make } from "@rbxts/altmake";
import { pseudoAnchor } from "shared/utils/pvUtils";
import { IdRepFocus, RepFocusData } from "./_list";

covenant.defineIdentity({
    identityComponent: IdRepFocus,
    replicated: true,
    recipe: (entities, updateId, { useEvent, useChange }) => {
        if (!RunService.IsServer()) {
            return {};
        }

        const statesToAdd: RepFocusData[] = [];
        const statesToRemove: RepFocusData[] = [];

        const playersAdded = useEvent(updateId, Players, Players.PlayerAdded).map(
            ([player]) => player,
        );

        if (useChange(updateId, [], "Once")) {
            Players.GetPlayers().forEach((player) => {
                playersAdded.push(player);
            });
        }

        const playersRemoved = useEvent(updateId, Players, Players.PlayerRemoving).map(
            ([player]) => player,
        );

        playersAdded.forEach((player) => {
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
            statesToAdd.push({ player: player, part: part });
        });

        playersRemoved.forEach((player) => {
            entities.forEach((entity, state) => {
                if (state.player !== player) return;
                statesToRemove.push(state);
            });
        });

        return { statesToCreate: statesToAdd, statesToDelete: statesToRemove };
    },
});
