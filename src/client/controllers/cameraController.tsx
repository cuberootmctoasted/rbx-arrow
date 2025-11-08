import { useCamera, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { RunService, UserInputService, Workspace } from "@rbxts/services";
import { useInputDevice } from "client/hooks/useInputDevice";

const DISTANCE_MIN = 5;
const DISTANCE_MAX = 25;

let goalX = 0;
let goalY = 0;
let goalDistance = 10;
let goalFocus = Vector3.zero;

let x = 0;
let y = 0;
let distance = 10;
let focus = Vector3.zero;

const raycastParams = new RaycastParams();

RunService.Heartbeat.Connect((dt) => {
    x = x + (goalX - x) * dt * 20;
    y = y + (goalY - y) * dt * 20;
    distance = distance + (goalDistance - distance) * dt * 10;
    focus = focus.Lerp(goalFocus, dt * 10);
});

export function CameraController({ character }: { character: PVInstance }) {
    const device = useInputDevice();

    const camera = useCamera();

    useMountEffect(() => {
        camera.CameraType = Enum.CameraType.Scriptable;
    });

    useEffect(() => {
        const head = character.WaitForChild("Head") as PVInstance;
        focus = head.GetPivot().Position;
        goalFocus = focus;

        const connection = RunService.Heartbeat.Connect(() => {
            goalFocus = head.GetPivot().Position;
        });

        return () => {
            connection.Disconnect();
        };
    }, [character]);

    useEffect(() => {
        const renderConnection = RunService.RenderStepped.Connect(() => {
            const rotation = CFrame.fromEulerAnglesYXZ(x, y, 0);

            const _cframe = rotation.add(focus);

            let correctedDistance = distance;
            const distanceCorrectionResult = Workspace.Raycast(
                _cframe.Position,
                _cframe.LookVector.mul(-(distance + 2)),
                raycastParams,
            );
            if (
                distanceCorrectionResult !== undefined &&
                distanceCorrectionResult.Instance.Transparency <= 0.1 &&
                distanceCorrectionResult.Instance.CanCollide
            ) {
                correctedDistance = math.max(
                    distanceCorrectionResult.Position.sub(_cframe.Position).Magnitude - 2,
                    2,
                );
            }

            camera.FieldOfView = correctedDistance * 3 + 10;
            camera.CameraType = Enum.CameraType.Fixed;
            camera.CFrame = _cframe.sub(_cframe.LookVector.mul(correctedDistance));
        });
        return () => {
            renderConnection.Disconnect();
        };
    }, [camera]);

    useEffect(() => {
        if (device === "gamepad") {
            // gamepad controls
            return;
        } else {
            const inputChangedConnection = UserInputService.InputChanged.Connect((input, gpe) => {
                if (gpe) return;
                if (input.UserInputType === Enum.UserInputType.MouseMovement) {
                    goalY -= input.Delta.X / 114;
                    goalX = math.clamp(
                        goalX - input.Delta.Y / 114,
                        (-80 / 180) * math.pi,
                        (80 / 180) * math.pi,
                    );
                } else if (
                    device === "keyboard" &&
                    input.UserInputType === Enum.UserInputType.MouseWheel
                ) {
                    goalDistance = math.clamp(
                        goalDistance + input.Position.Z * -5,
                        DISTANCE_MIN,
                        DISTANCE_MAX,
                    );
                }
            });

            return () => {
                inputChangedConnection.Disconnect();
            };
        }
    }, [device]);
    return <></>;
}
