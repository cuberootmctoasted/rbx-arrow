import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { syncedTime } from "shared/utils/syncedTime";

export function ItemFrame({
    itemOrigin,
    lookFrom,
    position,
    anchorPoint,
    size,
    rotSpeed,
}: {
    itemOrigin: PVInstance;
    lookFrom: Vector3;
    position?: UDim2;
    anchorPoint?: Vector2;
    size?: UDim2;
    rotSpeed: number;
}) {
    const [viewportframe, setViewportFrame] = useState<ViewportFrame>();

    const camera = useMemo(() => new Instance("Camera"), []);
    const item = useMemo(() => itemOrigin.Clone(), [itemOrigin]);

    useUnmountEffect(() => {
        camera.Destroy();
        item.Destroy();
    });

    useEffect(() => {
        camera.Parent = viewportframe;
        item.Parent = viewportframe;
    }, [viewportframe]);

    useEffect(() => {
        const connection = RunService.Heartbeat.Connect(() => {
            const tick = syncedTime() * rotSpeed;
            item.PivotTo(
                CFrame.identity.mul(
                    CFrame.fromEulerAnglesYXZ(0, (tick - math.floor(tick)) * math.pi * 2, 0),
                ),
            );
        });
        return () => {
            connection.Disconnect();
            item.Destroy();
        };
    }, [itemOrigin]);

    useEffect(() => {
        camera.CFrame = CFrame.lookAt(lookFrom, new Vector3(0, 0, 0));
    }, [camera, lookFrom]);

    return (
        <viewportframe
            BackgroundTransparency={1}
            BorderSizePixel={0}
            ref={setViewportFrame}
            Position={position}
            AnchorPoint={anchorPoint}
            Size={size}
            CurrentCamera={camera}
        />
    );
}
