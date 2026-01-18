import { CModel } from "../components/_list";
import { covenant } from "../covenant";

covenant.subscribeComponent(CModel, (entity, state, previousState, isDeleting) => {
    if (
        isDeleting === true &&
        state === undefined &&
        previousState !== undefined &&
        previousState.Parent !== undefined
    ) {
        previousState.Destroy();
    }
});
