import { RunService } from "@rbxts/services";
import { syncedTime } from "./utils/syncedTime";

export const DAY_NIGHT_CYCLE_MINUTES = 30;

export interface TimeOfDay {
    hours: number;
    minutes: number;
    seconds: number;
}

export function getDayProgress() {
    const dayProgress = ((syncedTime() / 60 / 60 / 24) * ((60 * 24) / DAY_NIGHT_CYCLE_MINUTES)) % 1;
    return dayProgress;
}

export function getTimeOfDay(): TimeOfDay {
    const dayProgress = getDayProgress();
    return {
        hours: math.floor(dayProgress * 24),
        minutes: math.floor(dayProgress * 24 * 60),
        seconds: math.floor(dayProgress * 24 * 60 * 60),
    };
}

export function getHoursOfDay(): number {
    const dayProgress = getDayProgress();
    return dayProgress * 24;
}
