import { createMotion, SpringOptions } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function createHighlight(
    adornee: PVInstance,
    fillOpacity: number,
    outlineOpacity: number,
    config: (instance: Highlight) => void,
    options?: SpringOptions,
) {
    const highlight = new Instance("Highlight");
    config(highlight);
    highlight.Adornee = adornee;
    highlight.Parent = adornee;

    const motion = createMotion(0);
    motion.spring(1, options);

    const connection = RunService.Heartbeat.Connect((dt) => {
        motion.step(dt);
        highlight.FillTransparency = 1 - motion.get() * fillOpacity;
        highlight.OutlineTransparency = 1 - motion.get() * outlineOpacity;
    });

    return () => {
        motion.spring(0, options);
        task.delay(1, () => {
            connection.Disconnect();
            highlight.Destroy();
        });
    };
}
