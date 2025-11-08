import { getBindingValue, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { Binding, useMemo, useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";

interface TransitionProps extends React.PropsWithChildren {
    groupTransparency?: number | Binding<number>;
    layoutOrder?: number | Binding<number>;
    zIndex?: number | Binding<number>;
    children?: React.ReactNode;
}

const EPSILON = 0.03;

export function Transition({ groupTransparency, zIndex, children }: TransitionProps) {
    const [frame, setFrame] = useState<Frame>();
    const [canvas, setCanvas] = useState<CanvasGroup>();

    const container = useMemo(() => {
        const container = new Instance("Frame");
        container.Name = "container";
        container.Size = new UDim2(1, 0, 1, 0);
        container.BackgroundTransparency = 1;
        return container;
    }, []);

    useEventListener(RunService.Heartbeat, () => {
        const transparency = getBindingValue(groupTransparency) ?? 0;

        pcall(() => {
            if (transparency > EPSILON) {
                container.Parent = canvas;
            } else {
                container.Parent = frame;
            }
        });
    });

    useUnmountEffect(() => {
        container.Destroy();
    });

    return (
        <frame
            BackgroundTransparency={1}
            Size={UDim2.fromScale(1, 1)}
            ZIndex={zIndex}
            key={"transition"}
        >
            {createPortal(<>{children}</>, container)}

            <canvasgroup
                key={"transition-off"}
                ref={setCanvas}
                GroupTransparency={groupTransparency}
                BackgroundTransparency={1}
                Size={new UDim2(1, 0, 1, 0)}
                Interactable={false}
                ClipsDescendants
            />

            <frame
                key={"transition-on"}
                ref={setFrame}
                BackgroundTransparency={1}
                Size={new UDim2(1, 0, 1, 0)}
                ClipsDescendants
            />
        </frame>
    );
}
