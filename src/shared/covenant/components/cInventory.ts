import { HttpService, RunService } from "@rbxts/services";
import { covenant } from "../covenant";
import { CInputs, CInventory, IdPlayer } from "./_list";
import Immut from "@rbxts/immut";

covenant.subscribeComponent(CInventory, (entity, state) => {
    print(state);
});

covenant.defineComponent({
    component: CInventory,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useComponentChange, useChange }) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        useComponentChange(updateId, CInputs);

        if (lastState === undefined) {
            return new ReadonlyMap([
                [HttpService.GenerateGUID(false), "basicCollector" as const],
                [HttpService.GenerateGUID(false), "basicDropper" as const],
                [HttpService.GenerateGUID(false), "smallConveyor" as const],
            ]);
        }

        const inputs = covenant.worldGet(entity, CInputs);

        if (useChange(updateId, [inputs?.place], tostring(entity)) && inputs?.place !== undefined) {
            print("heondesotnde");
            return Immut.produce(lastState, (draft) => {
                draft.delete(inputs.place!.guid);
            });
        }

        return lastState;
    },
});
