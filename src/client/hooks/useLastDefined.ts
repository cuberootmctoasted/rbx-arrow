import { useEffect, useState } from "@rbxts/react";

export function useLastDefined<T>(state: T) {
    const [definedState, setDefinedState] = useState(state);

    useEffect(() => {
        if (state === undefined) return;
        setDefinedState(state);
    }, [state]);

    return definedState;
}
