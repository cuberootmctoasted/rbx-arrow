import { InferComponent } from "@rbxts/covenant";
import { useEffect, useState } from "@rbxts/react";
import { covenant } from "shared/covenant";
import { CRoundSystem } from "shared/covenant/components/_list";

export function useRoundSystem() {
    const [roundSystem, setRoundSystem] = useState<
        InferComponent<typeof CRoundSystem> | undefined
    >();

    useEffect(() => {
        for (const [_, state] of covenant.worldQuery(CRoundSystem)) {
            setRoundSystem(state);
        }
        const unsubscribe = covenant.subscribeComponent(CRoundSystem, (_, state) => {
            setRoundSystem(state);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return roundSystem;
}
