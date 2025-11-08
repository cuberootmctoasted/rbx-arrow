import { Entity } from "@rbxts/covenant";
import { useEffect, useState } from "@rbxts/react";
import { covenant } from "shared/covenant";

export function useComponent<T>(entity: Entity, component: Entity<T>) {
    const [state, setState] = useState(covenant.worldGet(entity, component));

    useEffect(() => {
        setState(covenant.worldGet(entity, component));
        const unsubscribe = covenant.subscribeComponent(component, (theEntity, theState) => {
            if (theEntity !== entity) return;
            setState(theState);
        });
        return unsubscribe;
    }, [entity, component]);

    return state;
}
