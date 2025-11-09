import { Entity } from "@rbxts/covenant";
import React, { useEffect } from "@rbxts/react";
export function MovementController({ humanoid }: { humanoid: Humanoid }) {
    useEffect(() => {
        humanoid.WalkSpeed = 16;
        return () => {
            humanoid.WalkSpeed = 0;
        };
    }, [humanoid]);

    return <></>;
}
