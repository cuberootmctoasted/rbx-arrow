import { Entity } from "@rbxts/covenant";
import { covenant } from "./covenant";
import { CModel } from "./components/_list";

// helper performance map to determine where in the heck does one physical part in workspace belongs to in the ecs
export const entityParts: Map<BasePart, Entity> = new Map();

covenant.subscribeComponent(CModel, (entity, state, prevState) => {
    if (prevState !== undefined) {
        if (prevState.IsA("BasePart")) {
            entityParts.delete(prevState);
        }
        prevState
            .GetDescendants()
            .filter(
                (instance): instance is BasePart =>
                    instance.IsA("BasePart") && !entityParts.has(instance),
            )
            .forEach((part) => {
                entityParts.delete(part);
            });
    }
    if (state !== undefined) {
        if (state.IsA("BasePart")) {
            entityParts.set(state, entity);
        }
        state
            .GetDescendants()
            .filter(
                (instance): instance is BasePart =>
                    instance.IsA("BasePart") && !entityParts.has(instance),
            )
            .forEach((part) => {
                entityParts.set(part, entity);
            });
        const addedConnection = state.DescendantAdded.Connect((instance) => {
            if (instance.IsA("BasePart") && !entityParts.has(instance)) {
                entityParts.set(instance, entity);
            }
        });
        const removedConnection = state.DescendantRemoving.Connect((instance) => {
            if (instance.IsA("BasePart")) {
                entityParts.delete(instance);
            }
        });
        state.Destroying.Once(() => {
            removedConnection.Disconnect();
            addedConnection.Disconnect();
            state
                .GetDescendants()
                .filter((instance): instance is BasePart => instance.IsA("BasePart"))
                .forEach((part) => {
                    entityParts.delete(part);
                });
        });
    }
});
