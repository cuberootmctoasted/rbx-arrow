import { Entity } from "@rbxts/covenant";
import {
    getBindingValue,
    lerp,
    lerpBinding,
    useBindingListener,
    useEventListener,
    useMotion,
    useSpring,
} from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { PartFrame } from "client/components/partFrame";
import { Transition } from "client/components/transition";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { clientState } from "shared/clientState";
import { BG_1, FG_1 } from "shared/constants/themes";
import { covenant } from "shared/covenant";
import { CGrid, CGridRound, CInRound, COwnedGrid, CPlace } from "shared/covenant/components/_list";
import { syncedTime } from "shared/utils/syncedTime";

function Button({
    position0,
    position1,
    text,
    onClick,
    transition,
    special,
}: {
    position0: Vector3;
    position1: Vector3;
    text: string;
    onClick?: () => void;
    transition: React.Binding<number>;
    special?: boolean;
}) {
    const [hover, hoverApi] = useMotion(0);
    return (
        <PartFrame
            size={new Vector2(4, 1)}
            position={lerpBinding(transition, position0, position1)}
            orientation={new Vector3(0, 0, 0)}
            lightInfluence={0.5}
            pixelPerStud={50}
        >
            <Transition groupTransparency={lerpBinding(transition, 1, 0)}>
                <textbutton
                    AutoButtonColor={false}
                    BackgroundTransparency={0}
                    BackgroundColor3={lerpBinding(hover, BG_1, FG_1)}
                    BorderSizePixel={0}
                    TextSize={20}
                    Text={text}
                    TextColor3={lerpBinding(hover, FG_1, BG_1)}
                    Size={new UDim2(1, 0, 1, 0)}
                    Event={{
                        MouseEnter: () => {
                            hoverApi.spring(1);
                        },
                        MouseLeave: () => {
                            hoverApi.spring(0);
                        },
                        MouseButton1Click: onClick,
                    }}
                >
                    <uicorner></uicorner>
                    {special && (
                        <uistroke
                            ApplyStrokeMode={"Border"}
                            Thickness={2}
                            Color={lerpBinding(hover, FG_1, BG_1)}
                            BorderStrokePosition={"Inner"}
                        ></uistroke>
                    )}
                </textbutton>
            </Transition>
        </PartFrame>
    );
}

export function RoundSystem() {
    const playerEntity = usePlayerEntity();
    const cPlace = useComponent(playerEntity, CPlace);
    const cInRound = useComponent(playerEntity, CInRound);
    const balance = useSpring(
        cInRound !== undefined ? 0.5 : cPlace === "island" ? 1 : cPlace === "lobby" ? 0 : 0.5,
    );
    const balanceLeftHalf = balance.map((v) => math.clamp(v * 2, 0, 1));
    const balanceRightHalf = balance.map((v) => math.clamp(v * 2 - 1, 0, 1));

    const cOwnedGrid = useComponent(playerEntity, COwnedGrid);
    const grid = useMemo(
        () =>
            cOwnedGrid?.gridServerEntity !== undefined
                ? covenant.getClientEntity(cOwnedGrid.gridServerEntity)
                : undefined,
        [cOwnedGrid],
    );

    const cGridRound = useComponent(grid ?? (-1 as Entity), CGridRound);

    const [timeRemaining, setTimeRemaining] = useBinding(0);

    useEffect(() => {
        if (cGridRound === undefined) return;
        const connection = RunService.Heartbeat.Connect(() => {
            setTimeRemaining(math.max(cGridRound.endTime - syncedTime(), 0));
        });
        return () => {
            connection.Disconnect();
            setTimeRemaining(0);
        };
    }, [cGridRound]);

    const [timeRemainingText, setTimeRemainingText] = useBinding("");
    useBindingListener(timeRemaining, (t) => {
        const minutes = math.floor(t / 60);
        const seconds = math.floor(t % 60);
        const newText = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        if (newText === getBindingValue(timeRemainingText)) return;
        setTimeRemainingText(newText);
    });

    return (
        <>
            <PartFrame
                size={new Vector2(4, 1)}
                position={new Vector3(0, 10, 10)}
                orientation={lerpBinding(balance, new Vector3(0, -20, 0), new Vector3(0, 20, 0))}
                lightInfluence={0.5}
                pixelPerStud={50}
            >
                <textlabel
                    BackgroundTransparency={0}
                    BackgroundColor3={BG_1}
                    BorderSizePixel={0}
                    TextSize={20}
                    Text={
                        cInRound !== undefined
                            ? timeRemainingText
                            : cPlace === "island"
                              ? "Island"
                              : cPlace === "lobby"
                                ? "Lobby"
                                : "unknown"
                    }
                    TextColor3={FG_1}
                    Size={new UDim2(1, 0, 1, 0)}
                >
                    <uicorner></uicorner>
                </textlabel>
            </PartFrame>
            <Button
                position0={new Vector3(0, 10, 10)}
                position1={new Vector3(-2, 10, 10)}
                text={"go to island"}
                transition={lerpBinding(balanceLeftHalf, 1, 0)}
                onClick={() => {
                    clientState.inputs.goToIsland = syncedTime();
                }}
            ></Button>
            <Button
                position0={new Vector3(0, 10, 10)}
                position1={new Vector3(2, 10, 10)}
                text={"go to lobby"}
                transition={lerpBinding(balanceRightHalf, 0, 1)}
                onClick={() => {
                    clientState.inputs.goToLobby = syncedTime();
                }}
            ></Button>
            <Button
                position0={new Vector3(0, 7, 10)}
                position1={new Vector3(2, 7, 10)}
                text={"start round"}
                transition={lerpBinding(balanceRightHalf, 0, 1)}
                onClick={() => {
                    clientState.inputs.startRound = syncedTime();
                }}
                special
            ></Button>
        </>
    );
}
