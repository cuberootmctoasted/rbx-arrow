import { Players, RunService } from "@rbxts/services";
import { covenant } from "..";
import { IdPlayer } from "./_list";

covenant.defineIdentity({
    identityComponent: IdPlayer,
    replicated: true,
    recipe: (entities, updateId, { useEvent, useChange }) => {
        if (!RunService.IsServer()) return;

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

        return { statesToCreate: playersAdded, statesToDelete: playersRemoved };
    },
});
