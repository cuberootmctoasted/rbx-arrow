import React from "@rbxts/react";
import { DefaultPage } from "./default/default";
import { DayNightCycle } from "client/components/dayNightCycle";

export function Pages() {
    return (
        <>
            <DefaultPage />
            <DayNightCycle />
        </>
    );
}
