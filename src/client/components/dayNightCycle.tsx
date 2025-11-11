import { useEventListener } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Lighting, RunService } from "@rbxts/services";
import { getHoursOfDay, getTimeOfDay } from "shared/timeOfDay";

export function DayNightCycle() {
    useEventListener(RunService.Heartbeat, () => {
        Lighting.ClockTime = getHoursOfDay();
    });

    return <></>;
}
