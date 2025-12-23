import { covenant } from "../covenant";
import { CInputGoToIsland, CInputGoToLobby, CPlace, IdPlayer } from "./_list";

covenant.defineComponent({
    component: CPlace,
    queriedComponents: [[IdPlayer]],
    replicated: true,
    predictionValidator: false,
    recipe: (entity, lastState, updateId, { useEvent, useComponentChange }) => {
        const goToLobbies = useComponentChange(updateId, CInputGoToLobby);
        const goToIslands = useComponentChange(updateId, CInputGoToIsland);
        if (lastState === undefined) return "lobby";
        if (!goToLobbies.filter(({ entity: e }) => entity === e).isEmpty()) {
            return "lobby";
        }
        if (!goToIslands.filter(({ entity: e }) => entity === e).isEmpty()) {
            return "island";
        }
        return lastState;
    },
});
