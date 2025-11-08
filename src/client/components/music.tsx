import { useBindingListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import { SoundService } from "@rbxts/services";

interface MusicProps {
    soundId: string;
    volume: number | React.Binding<number>;
}

export function Music({ soundId, volume }: MusicProps) {
    const instance = useMemo(() => {
        const inst = new Instance("Sound");
        inst.Parent = SoundService;
        inst.Looped = true;
        inst.Name = soundId;
        inst.SoundId = soundId;
        return inst;
    }, []);

    useEffect(() => {
        instance.SoundId = soundId;
        instance.Name = soundId;
    }, [soundId]);

    useBindingListener(volume, (vol) => {
        if (vol > 0.03) {
            instance.Playing = true;
        } else {
            instance.Playing = false;
            instance.TimePosition = 0;
        }
        instance.Volume = vol;
    });

    useUnmountEffect(() => {
        instance.Destroy();
    });

    return <></>;
}
