import { useCamera, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { getPvAnyPart, getPvPrimaryPart } from "shared/utils/pvUtils";

export function ClassicCameraController({ character }: { character: PVInstance }) {
    const camera = useCamera();

    useEffect(() => {
        camera.CameraType = Enum.CameraType.Custom;
        camera.CameraSubject =
            character.FindFirstChildWhichIsA("Humanoid") ??
            getPvPrimaryPart(character) ??
            getPvAnyPart(character);
    }, [character]);

    return <></>;
}
