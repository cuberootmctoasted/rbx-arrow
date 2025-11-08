import React from "@rbxts/react";

export function Screen({ children }: React.PropsWithChildren) {
    return (
        <screengui ResetOnSpawn={false} IgnoreGuiInset={true} ZIndexBehavior={"Sibling"}>
            {children}
        </screengui>
    );
}
