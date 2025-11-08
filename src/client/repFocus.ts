import { RunService, Workspace } from "@rbxts/services";
import { covenant } from "shared/covenant";
import { CLocalRepFocus, IdRepFocus } from "shared/covenant/components/_list";

const camera = Workspace.CurrentCamera!;

RunService.Heartbeat.Connect(() => {
    for (const [entity, { part }] of covenant.worldQuery(IdRepFocus).with(CLocalRepFocus)) {
        //part?.PivotTo(new CFrame(100000, 0, 0));
        if (part === undefined) continue;
        if (camera.CFrame.Position.sub(part.Position).Magnitude < 20) continue;
        part.PivotTo(camera.CFrame);
    }
});
