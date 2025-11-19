import { Entity } from "@rbxts/covenant";
import { covenant } from "shared/covenant";

export function trackComponent(component: Entity, componentName: string) {
    covenant.subscribeComponent(component, (_, state) => {
        print(componentName);
        print(tostring(state));
    });
}
