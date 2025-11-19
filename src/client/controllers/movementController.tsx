import React, { useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { syncedTime } from "shared/utils/syncedTime";
export function MovementController({ humanoid }: { humanoid: Humanoid }) {
    useEffect(() => {
        humanoid.WalkSpeed = 16;
        let lastMoveTime = syncedTime();
        const connection = RunService.Heartbeat.Connect(() => {
            if (syncedTime() - lastMoveTime > 1) {
                humanoid.WalkSpeed = 30;
            } else {
                humanoid.WalkSpeed = 16;
            }
            if (humanoid.MoveDirection.Magnitude > 0) {
                if (lastMoveTime > syncedTime()) {
                    lastMoveTime = syncedTime();
                }
            } else {
                lastMoveTime = math.huge;
            }
        });
        return () => {
            connection.Disconnect();
            humanoid.WalkSpeed = 0;
        };
    }, [humanoid]);

    return <></>;
}
