import { useEventListener, useLatest } from "@rbxts/pretty-react-hooks";
import { useBinding, useEffect, useState } from "@rbxts/react";
import { RunService, UserInputService, Workspace } from "@rbxts/services";

export function useScreenSize() {
    const [screenSize, setScreenSize] = useState(
        Workspace.CurrentCamera?.ViewportSize ?? new Vector2(0, 0),
    );
    const latestScreenSize = useLatest(screenSize);
    useEventListener(RunService.Heartbeat, () => {
        if (latestScreenSize.current === Workspace.CurrentCamera?.ViewportSize) return;
        setScreenSize(Workspace.CurrentCamera?.ViewportSize ?? new Vector2(0, 0));
    });
    return screenSize;
}
