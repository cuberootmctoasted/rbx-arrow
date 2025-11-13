import { covenant } from "shared/covenant";
import { CollectionService, RunService, Workspace } from "@rbxts/services";
import { CModel, IdGrid, IdPlayer } from "./_list";
import { Entity, InferComponent } from "@rbxts/covenant";
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

const SERVER_ENTITY_ATTRIBUTE_NAME = "__SERVER_ENTITY__";
const STREAMABLE_TAG_NAME = "__STREAMABLE__";

if (RunService.IsServer()) {
    covenant.subscribeComponent(CModel, (entity, instance) => {
        if (instance === undefined) return;
        instance.AddTag(STREAMABLE_TAG_NAME);
        instance.SetAttribute(SERVER_ENTITY_ATTRIBUTE_NAME, entity);
    });
}

covenant.defineComponent({
    component: CModel,
    queriedComponents: [[IdPlayer], [IdGrid]], // add relevant components here
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
                    const serverEntity = instance.GetAttribute(SERVER_ENTITY_ATTRIBUTE_NAME) as
                        | Entity
                        | undefined;
                    if (serverEntity === undefined) return;
                    const entity = covenant.getClientEntity(serverEntity);
                    if (entity === undefined) return;
                    streamMap.set(tostring(entity), instance as PVInstance);
                    print(`Stream in ${serverEntity}-${entity}: ${instance.GetFullName()}`);
                    indicateUpdate();
                });

                const instancedAddedConnection = CollectionService.GetInstanceAddedSignal(
                    STREAMABLE_TAG_NAME,
                ).Connect((instance) => {
                    const serverEntity = instance.GetAttribute(SERVER_ENTITY_ATTRIBUTE_NAME) as
                        | Entity
                        | undefined;
                    if (serverEntity === undefined) return;
                    const entity = covenant.getClientEntity(serverEntity);
                    if (entity === undefined) return;
                    streamMap.set(tostring(entity), instance as PVInstance);
                    print(`Stream in ${serverEntity}-${entity}: ${instance.GetFullName()}`);
                    indicateUpdate();
                });

                const instanceRemovedConnection = CollectionService.GetInstanceRemovedSignal(
                    STREAMABLE_TAG_NAME,
                ).Connect((instance) => {
                    streamMap.forEach((model, stringifiedServerEntity) => {
                        if (model !== instance) return;
                        const entity = covenant.getClientEntity(
                            tonumber(stringifiedServerEntity) as Entity,
                        );
                        if (entity === undefined) return;
                        streamMap.delete(tostring(entity));
                        print(
                            `Stream out ${stringifiedServerEntity}-${entity}: ${instance.GetFullName()}`,
                        );
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
            if (covenant.worldHas(entity, IdGrid)) {
                return covenant.worldGet(entity, IdGrid)!.data;
            }
        }

        return undefined;
    },
});
