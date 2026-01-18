import { Make } from "@rbxts/altmake";
import {
    getBindingValue,
    useBindingListener,
    useCamera,
    useEventListener,
    useLatest,
} from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import { Players, RunService, Workspace } from "@rbxts/services";
import { useScreenSize } from "client/hooks/useScreenSize";

export function PartFrame({
    size,
    position,
    orientation,
    pixelPerStud,
    lightInfluence,
    children,
}: {
    size: Vector2 | React.Binding<Vector2>;
    position: Vector3 | React.Binding<Vector3>;
    orientation: Vector3 | React.Binding<Vector3>;
    pixelPerStud: number;
    lightInfluence: number;
} & React.PropsWithChildren) {
    const screenSize = useScreenSize();
    const ratio = useMemo(() => screenSize.X / screenSize.Y, [screenSize]);

    const part = useMemo(() => {
        return Make("Part", {
            Transparency: 1,
            CanCollide: false,
            Anchored: true,
            Size: new Vector3(getBindingValue(size).X, getBindingValue(size).Y, 1),
            Parent: Workspace,
        });
    }, []);

    const camera = useCamera();

    const latestRatio = useLatest(ratio);

    useBindingListener(size, (s) => {
        part.Size = new Vector3(s.X, s.Y, 1);
    });

    useEffect(() => {
        const connection = RunService.RenderStepped.Connect(() => {
            part.PivotTo(
                camera.CFrame.add(
                    camera.CFrame.RightVector.mul(getBindingValue(position).X).mul(
                        latestRatio.current,
                    ),
                )
                    .add(
                        camera.CFrame.UpVector.mul(getBindingValue(position).Y).mul(
                            1 / latestRatio.current,
                        ),
                    )
                    .add(camera.CFrame.LookVector.mul(getBindingValue(position).Z))
                    .mul(
                        CFrame.fromEulerAnglesYXZ(
                            math.rad(getBindingValue(orientation).X),
                            math.rad(getBindingValue(orientation).Y),
                            math.rad(getBindingValue(orientation).Z),
                        ),
                    ),
            );
        });
        return () => {
            part.Destroy();
            connection.Disconnect();
        };
    }, [part]);

    return (
        <surfacegui
            ClipsDescendants={true}
            Adornee={part}
            ResetOnSpawn={false}
            AlwaysOnTop={true}
            SizingMode={"PixelsPerStud"}
            PixelsPerStud={pixelPerStud}
            LightInfluence={lightInfluence}
            Face={"Back"}
            ZIndexBehavior={"Sibling"}
        >
            {children}
        </surfacegui>
    );
}
