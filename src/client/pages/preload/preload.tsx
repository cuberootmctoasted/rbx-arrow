import { lerpBinding, useAsync, useInterval, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo, useState } from "@rbxts/react";
import { ContentProvider, Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Screen } from "client/components/screen";
import { Transition } from "client/components/transition";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { BG_1 } from "shared/constants/themes";
import { CPage } from "shared/covenant/components/_list";
import { updateInputs } from "shared/inputs";

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

    useInterval(
        () => {
            rotationApi.immediate(0);
            rotationApi.spring(360, { frequency: 2 });
        },
        !ready ? 2 : undefined,
    );

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
        task.wait(2);
        setReady(true);
        task.wait(1);
        updateInputs((inputs) => {
            inputs.preloaded = true;
        });
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
                        Image={"rbxassetid://129387349650067"}
                        Rotation={rotation}
                        Size={new UDim2(0, 100, 0, 100)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        Position={new UDim2(0.5, 0, 0.5, 0)}
                    ></imagelabel>
                </frame>
            </Transition>
        </Screen>
    );
}
