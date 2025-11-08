import { useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { useMemo } from "@rbxts/react";
import { SpringOptions } from "@rbxts/ripple";
import { Players, RunService } from "@rbxts/services";

export function useMouseLean(springOptions?: SpringOptions) {
    const mouse = useMemo(() => Players.LocalPlayer.GetMouse(), []);
    const [lean, leanMotion] = useMotion(new Vector2(0, 0));

    useEventListener(RunService.Heartbeat, () => {
        const x = (mouse.X - mouse.ViewSizeX / 2) / mouse.ViewSizeX;
        const y = (mouse.Y - mouse.ViewSizeY / 2) / mouse.ViewSizeY;
        leanMotion.spring(new Vector2(x, y), springOptions);
    });

    return lean;
}
