import { useMouse } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Screen } from "./screen";

export function MouseFrame({ children }: React.PropsWithChildren) {
    const mousePos = useMouse();

    return (
        <Screen>
            <frame
                Position={mousePos.map((pos) => UDim2.fromOffset(pos.X, pos.Y))}
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
            >
                {children}
            </frame>
        </Screen>
    );
}
