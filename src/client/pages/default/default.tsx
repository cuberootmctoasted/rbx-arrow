import { lerpBinding, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { Screen } from "client/components/screen";
import { Transition } from "client/components/transition";
import { CameraController } from "client/controllers/cameraController";
import { MovementController } from "client/controllers/movementController";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { CGrid, CInRound, CModel, COwnedGrid, CPage } from "shared/covenant/components/_list";
import { GridEditor } from "./gridEditor/gridEditor";
import { covenant } from "shared/covenant";
import { Entity } from "@rbxts/covenant";
import { ClassicCameraController } from "client/controllers/classicCameraController";
import { DayNightMusic } from "./dayNightMusic";
import { PartFrame } from "client/components/partFrame";
import { RoundSystem } from "./roundSystem";

export function DefaultPage() {
    const playerEntity = usePlayerEntity();
    const page = useComponent(playerEntity, CPage);
    const visible = useMemo(() => page === "playing", [page]);
    const direction = useMemo(() => (visible ? "in" : "out"), [visible]);
    const transition = useTransition(visible, {
        in: MotionVariantOptions.spring({}),
        out: MotionVariantOptions.spring({}),
    });

    const character = useComponent(playerEntity, CModel);
    const humanoid = useMemo(() => character?.FindFirstChildWhichIsA("Humanoid"), [character]);

    const cOwnedGrid = useComponent(playerEntity, COwnedGrid);

    const inRound = useComponent(playerEntity, CInRound);
    const roundGrid = useMemo(() => {
        if (inRound === undefined) return undefined;
        return covenant.getClientEntity(inRound.gridServerEntity);
    }, [inRound]);

    return (
        <Screen>
            {visible && character && <ClassicCameraController character={character} />}
            {visible && humanoid && <MovementController humanoid={humanoid} />}
            {visible && inRound !== undefined && roundGrid !== undefined && (
                <GridEditor grid={roundGrid} />
            )}
            {visible && <DayNightMusic />}
            {visible && <RoundSystem />}
        </Screen>
    );
}
