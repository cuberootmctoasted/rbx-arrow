import { RunService, TeleportService } from "@rbxts/services";

// had help from ai

const ATTEMPT_LIMIT = 30;
const RETRY_DELAY = 1;

export function teleport(players: Player[], placeId: number, options?: TeleportOptions) {
    if (RunService.IsStudio()) {
        print(`Teleporting in Studio: ${placeId}`);
        return;
    }
    task.defer(() => {
        let attemptIndex = 0;
        let success = false;
        while (!(success || attemptIndex === ATTEMPT_LIMIT)) {
            try {
                print(`Teleporting to ${placeId}, attempt #${attemptIndex + 1}`);
                TeleportService.TeleportAsync(placeId, players, options);
                success = true;
            } catch {
                task.wait(RETRY_DELAY);
            } finally {
                attemptIndex++;
            }
        }

        if (success) {
            print(`Sucessfully teleported to ${placeId} with ${attemptIndex + 1} attempts`);
        }

        if (!success) {
            players.forEach((player) => {
                player.Kick("Teleport failed: try again later.");
            });
        }
    });
}
