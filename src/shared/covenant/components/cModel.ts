import { covenant } from "shared/covenant";
import { CollectionService, RunService, Workspace } from "@rbxts/services";
import { CModel, IdPlayer } from "./_list";
import { InferComponent } from "@rbxts/covenant";
import { CovenantHooks } from "@rbxts/covenant/src/hooks";

export function processPlayerModel(
    player: InferComponent<typeof IdPlayer>,
    updateId: number,
    useEvent: CovenantHooks["useEvent"],
): PVInstance | undefined {
    useEvent(updateId, player, player.CharacterAppearanceLoaded);
    useEvent(updateId, player, player.CharacterRemoving);

    return player.Character;
}

const ENTITY_ATTRIBUTE_NAME = "__ENTITY__";
const STREAMABLE_TAG_NAME = "__STREAMABLE__";

if (RunService.IsServer()) {
    covenant.subscribeComponent(CModel, (entity, instance) => {
        if (instance === undefined) return;
        instance.AddTag(STREAMABLE_TAG_NAME);
        instance.SetAttribute(ENTITY_ATTRIBUTE_NAME, entity);
    });
}

covenant.defineComponent({
    component: CModel,
    queriedComponents: [[IdPlayer]], // add relevant components here
    replicated: true,
    predictionValidator: () => true,
    recipe: (entity, lastState, updateId, { useEvent, useImperative }) => {
        const streamMap = useImperative(
            updateId,
            (indicateUpdate) => {
                const streamMap: Map<string, PVInstance> = new Map();

                if (!RunService.IsClient()) {
                    return { value: streamMap };
                }

                CollectionService.GetTagged(STREAMABLE_TAG_NAME).forEach((instance) => {
                    const entity = instance.GetAttribute(ENTITY_ATTRIBUTE_NAME) as
                        | number
                        | undefined;
                    if (entity === undefined) return;
                    streamMap.set(tostring(entity), instance as PVInstance);
                    //print(`Stream in ${entity}: ${instance.GetFullName()}`);
                    indicateUpdate();
                });

                const instancedAddedConnection = CollectionService.GetInstanceAddedSignal(
                    STREAMABLE_TAG_NAME,
                ).Connect((instance) => {
                    const entity = instance.GetAttribute(ENTITY_ATTRIBUTE_NAME) as
                        | number
                        | undefined;
                    if (entity === undefined) return;
                    streamMap.set(tostring(entity), instance as PVInstance);
                    //print(`Stream in ${entity}: ${instance.GetFullName()}`);
                    indicateUpdate();
                });

                const instanceRemovedConnection = CollectionService.GetInstanceRemovedSignal(
                    STREAMABLE_TAG_NAME,
                ).Connect((instance) => {
                    streamMap.forEach((model, key) => {
                        if (model !== instance) return;
                        streamMap.delete(key);
                        //print(`Stream out ${key}: ${instance.GetFullName()}`);
                    });
                    indicateUpdate();
                });

                return {
                    value: streamMap,
                    cleanup: () => {
                        instancedAddedConnection.Disconnect();
                        instanceRemovedConnection.Disconnect();
                    },
                };
            },
            [],
            "streamMap",
        );
        if (RunService.IsClient() && lastState === undefined) {
            const instance = streamMap.get(tostring(entity));
            if (instance === undefined) return undefined;
            return instance;
        }

        if (lastState !== undefined && !lastState.IsDescendantOf(Workspace)) return undefined;
        if (lastState !== undefined) return lastState;

        if (RunService.IsServer()) {
            if (covenant.worldHas(entity, IdPlayer)) {
                return processPlayerModel(covenant.worldGet(entity, IdPlayer)!, updateId, useEvent);
            }
            // this is where other entities where the physical model is in the game and the id component exists
        }

        return undefined;
    },
});
