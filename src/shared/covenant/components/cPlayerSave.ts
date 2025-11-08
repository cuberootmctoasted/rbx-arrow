import { Collection, createCollection, Document } from "@rbxts/lapis";
import { covenant } from "../covenant";
import { defaultPlayerSave, PlayerSave } from "../playerSave";
import { Players, RunService } from "@rbxts/services";
import { CPlayerSave, IdPlayer } from "./_list";
import { Entity } from "@rbxts/covenant";
import { CovenantHooks } from "@rbxts/covenant/src/hooks";

// WARNING: if importing lapis in the client will show an error, go into the source code of lapis in init.luau and turn the true to false in Internal.new(true)
// for consistency purposes, I think this is the only work around that I have for the api, trust me, this doesn't mean convenant is not worth using

export function processPlayerSave(
    entity: Entity,
    player: Player,
    lastSave: PlayerSave,
    updateId: number,
    hooks: CovenantHooks,
): PlayerSave {
    // how player save interacts with other components
    return lastSave;
}

covenant.defineComponent({
    component: CPlayerSave,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, hooks) => {
        if (!RunService.IsServer()) {
            return lastState;
        }

        const documents = hooks.useImperative(
            updateId,
            (indicateUpdate) => {
                let temp: Collection<PlayerSave, true> | undefined = undefined;
                const [_, err] = pcall(() => {
                    temp = createCollection("players", {
                        defaultData: defaultPlayerSave,
                    });
                });

                if (temp === undefined) {
                    warn(`Datastore not loaded: ${err}`);
                    return { value: new Map<Player, Document<PlayerSave, true>>() };
                }

                const collection = temp as Collection<PlayerSave, true>;

                const documents: Map<Player, Document<PlayerSave, true>> = new Map();

                async function loadPlayerSave(player: Player) {
                    try {
                        const document = await collection.load(tostring(player.UserId));

                        if (!player.IsDescendantOf(Players)) {
                            document.close();
                            return;
                        }

                        documents.set(player, document);
                        indicateUpdate();
                    } catch (e) {
                        player.Kick();
                    }
                }

                function closePlayerSave(player: Player) {
                    const document = documents.get(player);
                    if (document === undefined) return;
                    document.close();
                    documents.delete(player);
                    indicateUpdate();
                }

                const unsubscribePlrSave = covenant.subscribeComponent(
                    CPlayerSave,
                    (entity, state) => {
                        if (state === undefined) return;
                        const player = covenant.worldGet(entity, IdPlayer);
                        if (player === undefined) return;
                        const document = documents.get(player);
                        if (document === undefined) return;
                        if (state === document.read()) return;
                        document.write(state);
                    },
                );

                const unsubscribePlr = covenant.subscribeComponent(
                    IdPlayer,
                    (_, state, prevState) => {
                        if (state !== undefined && prevState === undefined) {
                            loadPlayerSave(state);
                        } else if (state === undefined && prevState !== undefined) {
                            closePlayerSave(prevState);
                        }
                    },
                );

                return {
                    value: documents,
                    cleanup: () => {
                        unsubscribePlr();
                        unsubscribePlrSave();
                    },
                };
            },
            [],
            "Datastore",
        );

        const player = covenant.worldGet(entity, IdPlayer);
        if (player === undefined) return undefined;

        const document = documents.get(player);

        if (document === undefined) {
            return defaultPlayerSave;
        }
        if (document !== undefined && lastState === undefined) {
            return document.read();
        }
        if (document !== undefined && lastState !== undefined) {
            return processPlayerSave(entity, player, lastState, updateId, hooks);
        }
    },
});
