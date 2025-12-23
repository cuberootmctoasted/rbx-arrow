import { Entity } from "@rbxts/covenant";
import { covenant } from "shared/covenant";

export function trackComponent(component: Entity, componentName: string) {
    covenant.subscribeComponent(component, (e, state) => {
        print(e);
        print(componentName);
        print(tostring(state));
    });
}
