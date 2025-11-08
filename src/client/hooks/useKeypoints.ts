import { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";

export function useKeypoints(
    willPlay: boolean,
    cleanup: () => void,
    keypoints: [time: number, () => void][],
) {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setCompleted(!willPlay);
    }, [willPlay]);

    useEffect(() => {
        if (completed) return;
        if (!willPlay) return;
        const remainingKeypoints = table.clone(keypoints);
        let currentKeypoint = remainingKeypoints.shift();
        let currentTime = 0;
        let nextKeypointTime = currentKeypoint !== undefined ? currentKeypoint[0] : 0;

        const connection = RunService.Heartbeat.Connect((dt) => {
            currentTime += dt;
            if (currentKeypoint === undefined) {
                setCompleted(true);
                return;
            }
            if (currentTime < nextKeypointTime) return;
            currentKeypoint[1]();
            currentKeypoint = remainingKeypoints.shift();
            nextKeypointTime += currentKeypoint !== undefined ? currentKeypoint[0] : 0;
        });

        return () => {
            cleanup();
            connection.Disconnect();
        };
    }, [willPlay, completed]);

    return undefined;
}
