import { lerpBinding, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { Screen } from "client/components/screen";
import { Transition } from "client/components/transition";
import { CameraController } from "client/controllers/cameraController";
import { MovementController } from "client/controllers/movementController";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { CGrid, CInRound, CModel, CPage } from "shared/covenant/components/_list";
import { GridEditor } from "./gridEditor/gridEditor";
import { covenant } from "shared/covenant";
import { Entity } from "@rbxts/covenant";
import { ClassicCameraController } from "client/controllers/classicCameraController";
import { DayNightMusic } from "./dayNightMusic";
import { useRoundSystem } from "client/hooks/useRoundSystem";
import { RoundTimer } from "./roundTimer";

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

    const roundSystem = useRoundSystem();
    const inRound = useComponent(playerEntity, CInRound);
    const previousInRound = usePrevious(inRound);

    const inTransition = useMemo(() => {
        if (roundSystem === undefined) return false;
        return (
            (roundSystem.loadingRound && inRound !== undefined) ||
            (roundSystem.loadingIntermission && previousInRound !== undefined)
        );
    }, [roundSystem, inRound, previousInRound]);

    const [grid, setGrid] = useState<Entity>();

    useEffect(() => {
        for (const [entity, state] of covenant.worldQuery(CGrid)) {
            if (
                state.ownerServerEntity !== undefined &&
                covenant.getClientEntity(state?.ownerServerEntity) === playerEntity
            ) {
                setGrid(entity);
            }
        }

        const unsubcribe = covenant.subscribeComponent(CGrid, (entity, state) => {
            if (
                state?.ownerServerEntity !== undefined &&
                covenant.getClientEntity(state?.ownerServerEntity) === playerEntity
            ) {
                setGrid(entity);
            }
        });

        return () => {
            unsubcribe();
        };
    }, [playerEntity]);

    return (
        <Screen>
            <Transition groupTransparency={lerpBinding(transition, 1, 0)}>
                <RoundTimer />
            </Transition>
            {visible && !inTransition && character && (
                <ClassicCameraController character={character} />
            )}
            {visible && !inTransition && humanoid && <MovementController humanoid={humanoid} />}
            {visible && !inTransition && grid !== undefined && <GridEditor grid={grid} />}
            {visible && <DayNightMusic />}
        </Screen>
    );
}
