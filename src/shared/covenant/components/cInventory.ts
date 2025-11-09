import { HttpService, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInventory, IdPlayer } from "./_list";

covenant.defineComponent({
    component: CInventory,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        return new ReadonlyMap([
            [HttpService.GenerateGUID(false), "basicCollector" as const],
            [HttpService.GenerateGUID(false), "basicDropper" as const],
            [HttpService.GenerateGUID(false), "smallConveyor" as const],
        ]);
    },
});
