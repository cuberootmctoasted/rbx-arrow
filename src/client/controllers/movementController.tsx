import { Entity } from "@rbxts/covenant";
import { useCamera } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { useComponent } from "client/hooks/useComponent";
import { useKeybind } from "client/hooks/useKeybind";
import { CInputs } from "shared/covenant/components/_list";
import { updateInputs } from "shared/inputs";

export function MovementController({
    playerEntity,
    humanoid,
}: {
    playerEntity: Entity;
    humanoid: Humanoid;
}) {
    const camera = useCamera();

    const forward = useKeybind("forward");
    const backward = useKeybind("backward");
    const left = useKeybind("left");
    const right = useKeybind("right");

    const jump = useKeybind("jump");

    useEffect(() => {
        updateInputs((inputs) => {
            inputs.jump = jump || undefined;
        });
    }, [jump]);

    useEffect(() => {
        let moveDirection = Vector2.zero;
        if (forward) {
            moveDirection = moveDirection.add(new Vector2(0, 1));
        }
        if (backward) {
            moveDirection = moveDirection.add(new Vector2(-1, 0));
        }
        if (left) {
            moveDirection = moveDirection.add(new Vector2(0, -1));
        }
        if (right) {
            moveDirection = moveDirection.add(new Vector2(1, 0));
        }
        updateInputs((inputs) => {
            inputs.moveDirection = moveDirection.Magnitude > 0 ? moveDirection : undefined;
        });
    }, [forward, backward, left, right]);

    const inputs = useComponent(playerEntity, CInputs);

    useEffect(() => {
        const moveDirection = inputs?.moveDirection;
        if (moveDirection === undefined) {
            humanoid.WalkSpeed = 0;
            return;
        }
        humanoid.WalkSpeed = 16;
        const connection = RunService.Heartbeat.Connect(() => {
            const realMoveDirection = camera.CFrame.LookVector.mul(moveDirection.Y).add(
                camera.CFrame.RightVector.mul(moveDirection.X),
            );
            humanoid.Move(realMoveDirection);
        });
        return () => {
            connection.Disconnect();
        };
    }, [inputs, camera, humanoid]);

    useEffect(() => {
        humanoid.Jump = inputs?.jump ?? false;
    }, [inputs, humanoid]);

    return <></>;
}
