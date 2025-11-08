import React from "@rbxts/react";

export function lerpText(text: string, binding: React.Binding<number>) {
    return binding.map((perc) => text.sub(0, math.ceil(text.size() * perc)));
}
