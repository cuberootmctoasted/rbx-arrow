import { useEffect, useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { FlexInput, getFlexibleInput } from "shared/flexInputs";

export function useFlexInput(flexInput: FlexInput) {
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        const beganConnection = UserInputService.InputBegan.Connect((input, gPE) => {
            if (gPE) return;
            const fInput = getFlexibleInput(input);
            if (fInput !== flexInput) return;
            setPressed(true);
        });
        const changedConnection = UserInputService.InputChanged.Connect((input, gPE) => {
            const fInput = getFlexibleInput(input);
            if (fInput !== flexInput) return;
            if (gPE) {
                setPressed(false);
            } else {
                setPressed(true);
            }
        });
        const endedConnection = UserInputService.InputEnded.Connect((input, gPE) => {
            const fInput = getFlexibleInput(input);
            if (fInput !== flexInput) return;
            setPressed(false);
        });
        return () => {
            beganConnection.Disconnect();
            changedConnection.Disconnect();
            endedConnection.Disconnect();
        };
    }, [flexInput]);

    return pressed;
}
