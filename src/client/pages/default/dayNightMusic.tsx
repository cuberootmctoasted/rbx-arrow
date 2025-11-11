import { useEventListener, useLatest, useSpring } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { Music } from "client/components/music";
import { DAY_MUSICS, NIGHT_MUSICS } from "shared/constants/assets";
import { getHoursOfDay, getTimeOfDay } from "shared/timeOfDay";
import { path } from "shared/utils/path";

function getIsDay() {
    const hours = getHoursOfDay();
    return hours >= 7 && hours < 18;
}

export function DayNightMusic() {
    const [isDay, setIsDay] = useState(getIsDay());
    const latestIsDay = useLatest(isDay);
    const dayMusicOrigin = useMemo(() => {
        return DAY_MUSICS[math.random(0, DAY_MUSICS.size() - 1)];
    }, [isDay]);
    const nightMusicOrigin = useMemo(() => {
        return NIGHT_MUSICS[math.random(0, NIGHT_MUSICS.size() - 1)];
    }, [isDay]);

    const dayMusicVolume = useSpring(isDay ? dayMusicOrigin.Volume : 0, { frequency: 5 });
    const nightMusicVolume = useSpring(isDay ? 0 : nightMusicOrigin.Volume, { frequency: 5 });

    useEventListener(RunService.Heartbeat, () => {
        const newIsDay = getIsDay();
        if (newIsDay === latestIsDay.current) return;
        setIsDay(newIsDay);
    });

    return (
        <>
            <Music
                soundId={dayMusicOrigin.SoundId}
                volume={dayMusicVolume}
                speed={dayMusicOrigin.PlaybackSpeed}
            />
            <Music
                soundId={nightMusicOrigin.SoundId}
                volume={nightMusicVolume}
                speed={nightMusicOrigin.PlaybackSpeed}
            />
        </>
    );
}
