import { useMemo } from "@rbxts/react";
import { Lighting } from "@rbxts/services";

function getInstance<T extends keyof CreatableInstances>(className: T) {
    let instance: CreatableInstances[T] | undefined = Lighting.FindFirstChildWhichIsA(className);
    if (instance === undefined) {
        instance = new Instance(className);
        instance.Parent = Lighting;
    }
    return instance;
}

export function useLighting() {
    const lighting = useMemo(() => Lighting, []);
    return lighting;
}

export function useAtmosphere() {
    const atmosphere = useMemo(() => getInstance("Atmosphere"), []);
    return atmosphere;
}

export function useSunRaysEffect() {
    const sunRaysEffect = useMemo(() => getInstance("SunRaysEffect"), []);
    return sunRaysEffect;
}

export function useColorCorrectionEffect() {
    const colorCorrectionEffect = useMemo(() => getInstance("ColorCorrectionEffect"), []);
    return colorCorrectionEffect;
}

export function useBloomEffect() {
    const bloomEffect = useMemo(() => getInstance("BloomEffect"), []);
    return bloomEffect;
}

export function useBlurEffect() {
    const blurEffect = useMemo(() => getInstance("BlurEffect"), []);
    return blurEffect;
}
