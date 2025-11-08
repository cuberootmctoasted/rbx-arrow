import { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";

export function useChangable<T>(getter: () => T) {
    const [state, setState] = useState(getter);

    useEffect(() => {
        const connection = RunService.Heartbeat.Connect(() => {
            const newState = getter();
            if (newState === state) return;
            setState(newState);
        });
        return () => {
            connection.Disconnect();
        };
    }, [state]);

    return state;
}
