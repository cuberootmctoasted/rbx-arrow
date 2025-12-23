import { blend, lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { PartFrame } from "client/components/partFrame";
import { Screen } from "client/components/screen";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { MotionVariantOptions, useTransition } from "client/hooks/useTransition";
import { BG_1, FG_1 } from "shared/constants/themes";
import { CPage } from "shared/covenant/components/_list";
import { IslandRotator } from "./islandRotator";
import { clientState } from "shared/clientState";
import { syncedTime } from "shared/utils/syncedTime";

function Button({ text, offset, onClick }: { text: string; offset: number; onClick?: () => void }) {
    const [hover, hoverApi] = useMotion(0);
    return (
        <PartFrame
            size={new Vector2(4, 1)}
            position={hover.map((v) => new Vector3(-4 + v, -offset * 3, 10))}
            orientation={hover.map((v) => new Vector3(0, (1 - v) * 40, 0))}
            lightInfluence={0.5}
            pixelPerStud={50}
        >
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
            </textbutton>
        </PartFrame>
    );
}

export function StartPage() {
    const playerEntity = usePlayerEntity();
    const page = useComponent(playerEntity, CPage);
    const visible = useMemo(() => page === "start", [page]);
    const direction = useMemo(() => (visible ? "in" : "out"), [visible]);
    const transition = useTransition(visible, {
        in: MotionVariantOptions.spring({}),
        out: MotionVariantOptions.spring({}),
    });
    // TODO: next step, make a camera for that system

    return (
        <Screen>
            {visible && (
                <>
                    <IslandRotator></IslandRotator>
                    <Button
                        text={"START"}
                        offset={-2}
                        onClick={() => {
                            clientState.inputs.start = syncedTime();
                        }}
                    />
                    <Button text={"what"} offset={-1} />
                    <Button text={"the"} offset={0} />
                    <Button text={"heck"} offset={1} />
                </>
            )}
        </Screen>
    );
}
