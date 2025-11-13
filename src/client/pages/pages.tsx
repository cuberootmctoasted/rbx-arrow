import React from "@rbxts/react";
import { DefaultPage } from "./default/default";
import { DayNightCycle } from "client/components/dayNightCycle";
import { Preload } from "./preload/preload";

export function Pages() {
    return (
        <>
            <DefaultPage />
            <Preload />
            <DayNightCycle />
        </>
    );
}
