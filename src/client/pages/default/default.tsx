import { lerpBinding } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { Screen } from "client/components/screen";
import { Transition } from "client/components/transition";
import { CameraController } from "client/controllers/cameraController";
import { MovementController } from "client/controllers/movementController";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { CModel, CPage } from "shared/covenant/components/_list";

export function DefaultPage() {
    const playerEntity = usePlayerEntity();
    const page = useComponent(playerEntity, CPage);
    const visible = useMemo(() => page === "placeholder", [page]);
    const direction = useMemo(() => (visible ? "in" : "out"), [visible]);
    const transition = useTransition(visible, {
        in: MotionVariantOptions.spring({}),
        out: MotionVariantOptions.spring({}),
    });

    const character = useComponent(playerEntity, CModel);
    const humanoid = useMemo(() => character?.FindFirstChildWhichIsA("Humanoid"), [character]);

    return (
        <Screen>
            <Transition groupTransparency={lerpBinding(transition, 1, 0)}></Transition>
            {visible && character && <CameraController character={character} />}
            {visible && humanoid && (
                <MovementController playerEntity={playerEntity} humanoid={humanoid} />
            )}
        </Screen>
    );
}
