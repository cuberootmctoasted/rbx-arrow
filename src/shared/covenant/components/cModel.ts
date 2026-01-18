import { covenant } from "shared/covenant";
import { CollectionService, RunService, Workspace } from "@rbxts/services";
import { CModel, IdGrid, IdPlacement, IdPlayer } from "./_list";
import { Entity, InferComponent } from "@rbxts/covenant";
import { CovenantHooks } from "@rbxts/covenant/src/hooks";
import { Items } from "shared/datas/items";
import { getPlacementCf } from "shared/datas/placement";
import { trackComponent } from "shared/utils/trackComponent";
import { syncedTime } from "shared/utils/syncedTime";

export function processPlayerModel(
    player: InferComponent<typeof IdPlayer>,
    updateId: number,
    useEvent: CovenantHooks["useEvent"],
): PVInstance | undefined {
    useEvent(updateId, player, player.CharacterAppearanceLoaded);
    useEvent(updateId, player, player.CharacterRemoving);

    return player.Character;
}

export const SERVER_ENTITY_ATTRIBUTE_NAME = "__SERVER_ENTITY__";
export const STREAMABLE_TAG_NAME = "__STREAMABLE__";

trackComponent(CModel);

if (RunService.IsServer()) {
    covenant.subscribeComponent(CModel, (entity, instance) => {
        if (instance === undefined) return;
        instance.AddTag(STREAMABLE_TAG_NAME);
        instance.SetAttribute(SERVER_ENTITY_ATTRIBUTE_NAME, entity);
    });
}

// TODO something is severely wrong with this

covenant.defineComponent({
    component: CModel,
    queriedComponents: [[IdPlayer], [IdGrid], [IdPlacement]], // add relevant components here
    replicated: true,
    predictionValidator: false,
    recipe: (theEntity, lastState, updateId, { useEvent, useImperative }) => {
        useEvent(updateId, RunService, RunService.Heartbeat);
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
                    if (entity === undefined) {
                        task.spawn(() => {
                            const startTime = syncedTime();
                            while (syncedTime() < startTime + 5) {
                                task.wait();
                                const entity = covenant.getClientEntity(serverEntity);
                                if (entity === undefined) continue;
                                if (instance === undefined) continue;
                                if (!instance.IsDescendantOf(Workspace)) continue;
                                streamMap.set(tostring(entity), instance as PVInstance);
                                print(
                                    `Stream in ${serverEntity}-${entity}: ${instance.GetFullName()}`,
                                );
                                indicateUpdate();
                                break;
                            }
                        });
                        return;
                    }
                    if (instance === undefined) return;
                    if (!instance.IsDescendantOf(Workspace)) return;
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
                    if (instance === undefined) return;
                    if (!instance.IsDescendantOf(Workspace)) return;
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
                        indicateUpdate();
                    });
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

        if (lastState !== undefined && lastState.IsDescendantOf(Workspace) === false)
            return undefined;
        if (lastState !== undefined) return lastState;

        if (RunService.IsClient() && lastState === undefined) {
            const instance = streamMap.get(tostring(theEntity));
            return instance;
        }

        if (RunService.IsServer()) {
            if (covenant.worldHas(theEntity, IdPlayer) === true) {
                return processPlayerModel(
                    covenant.worldGet(theEntity, IdPlayer)!,
                    updateId,
                    useEvent,
                );
            }
            // this is where other entities where the physical model is in the game and the id component exists
            if (covenant.worldHas(theEntity, IdGrid) === true) {
                return covenant.worldGet(theEntity, IdGrid)!.data;
            }
            if (covenant.worldHas(theEntity, IdPlacement) === true) {
                const placement = covenant.worldGet(theEntity, IdPlacement)!;
                const grid = placement.gridServerEntity;
                const gridModel = covenant.worldGet(grid, CModel);
                if (gridModel === undefined) return undefined;
                const model = Items[placement.itemName].origin.Clone();
                model.Parent = Workspace;
                model.PivotTo(getPlacementCf(gridModel.GetPivot(), placement.position));
                return model;
            }
        }

        return undefined;
    },
});
