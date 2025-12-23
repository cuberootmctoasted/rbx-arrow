import React from "@rbxts/react";
import { DefaultPage } from "./default/default";
import { DayNightCycle } from "client/components/dayNightCycle";
import { Preload } from "./preload/preload";
import { StartPage } from "./start/start";

export function Pages() {
    return (
        <>
            <DefaultPage />
            <Preload />
            <StartPage />
            <DayNightCycle />
        </>
    );
}
