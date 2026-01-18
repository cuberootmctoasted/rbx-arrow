import { HttpService, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputPlace, CInRound, CInventory, IdPlayer } from "./_list";
import Immut from "@rbxts/immut";

covenant.defineComponent({
    component: CInventory,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange, useChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        useComponentChange(updateId, CInputPlace, false);
        const place = covenant.worldGet(entity, CInputPlace);

        const roundChanges = useComponentChange(updateId, CInRound, false);

        if (
            lastState === undefined ||
            !roundChanges.filter(({ entity: e }) => entity === e).isEmpty()
        ) {
            return new ReadonlyMap([
                [HttpService.GenerateGUID(false), "basicCollector" as const],
                [HttpService.GenerateGUID(false), "basicDropper" as const],
                [HttpService.GenerateGUID(false), "smallConveyor" as const],
            ]);
        }

        if (useChange(updateId, [place], tostring(entity)) && place !== undefined) {
            return Immut.produce(lastState, (draft) => {
                draft.delete(place.guid);
            });
        }

        return lastState;
    },
});
