import { lerpBinding, useAsync, useInterval, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo, useState } from "@rbxts/react";
import {
    ContentProvider,
    Players,
    ReplicatedStorage,
    RunService,
    Workspace,
} from "@rbxts/services";
import { Screen } from "client/components/screen";
import { Transition } from "client/components/transition";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { clientState } from "shared/clientState";
import { BG_1 } from "shared/constants/themes";
import { CPage } from "shared/covenant/components/_list";

const ASSETS: Instance[] = [Workspace, ReplicatedStorage.WaitForChild("assets")];

export function Preload() {
    const playerEntity = usePlayerEntity();
    const page = useComponent(playerEntity, CPage);
    const visible = useMemo(() => page === "preload", [page]);
    const direction = useMemo(() => (visible ? "in" : "out"), [visible]);
    const transition = useTransition(visible, {
        in: MotionVariantOptions.immediate({}),
        out: MotionVariantOptions.linear({ speed: 1 }),
    });

    const [ready, setReady] = useState(false);

    const [rotation, rotationApi] = useMotion(0);

    const rng = useMemo(() => {
        return math.random() <= 0.1;
    }, []);

    useInterval(
        () => {
            if (rng) return;
            rotationApi.immediate(0);
            rotationApi.spring(360, { frequency: 2 });
        },
        !ready ? 2 : undefined,
    );

    const [scale, setScale] = useBinding(0);
    const [offset, setOffset] = useBinding(new UDim2(0, 0, 0, 0));

    useEffect(() => {
        if (!rng) return;
        const connection = RunService.Heartbeat.Connect(() => {
            setScale(math.random() / 2);
            setOffset(new UDim2((math.random() - 0.5) / 2, 0, (math.random() - 0.5) / 2, 0));
            rotationApi.immediate(math.random(0, 360));
        });
        return () => {
            connection.Disconnect();
        };
    }, [rng]);

    useAsync(async () => {
        if (!visible) return;
        if (ready) return;
        const prepreload =
            Players.LocalPlayer.WaitForChild("PlayerGui").FindFirstChild("PREPRELOAD");
        if (prepreload !== undefined) {
            task.delay(0.1, () => {
                prepreload.Destroy();
            });
        }
        ContentProvider.PreloadAsync(ASSETS);
        task.wait(5);
        setReady(true);
        task.wait(1);
        clientState.loaded = true;
    }, [visible]);

    return (
        <Screen>
            <Transition groupTransparency={lerpBinding(transition, 1, 0)}>
                <frame
                    BackgroundColor3={BG_1}
                    Size={new UDim2(5, 0, 5, 0)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    Position={new UDim2(0.5, 0, 0.5, 0)}
                >
                    <imagelabel
                        BackgroundTransparency={1}
                        BorderSizePixel={0}
                        Image={"rbxassetid://139833628343860"}
                        Rotation={rotation}
                        Size={scale.map((v) => new UDim2(v, 100, v, 100))}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        Position={offset.map(
                            (v) =>
                                new UDim2(0.5 + v.X.Scale, v.X.Offset, 0.5 + v.Y.Scale, v.Y.Offset),
                        )}
                    ></imagelabel>
                </frame>
            </Transition>
        </Screen>
    );
}
