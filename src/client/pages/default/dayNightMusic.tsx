import {
    lerp,
    lerpBinding,
    useEventListener,
    useLatest,
    useSpring,
} from "@rbxts/pretty-react-hooks";
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
    const [dayMusicOrigin, setDayMusicOrigin] = useState(
        DAY_MUSICS[math.random(0, DAY_MUSICS.size() - 1)],
    );
    const [nightMusicOrigin, setNightMusicOrigin] = useState(
        NIGHT_MUSICS[math.random(0, NIGHT_MUSICS.size() - 1)],
    );

    const dayMusicVolume = useSpring(isDay ? 1 : 0, { frequency: 10 });
    const nightMusicVolume = useSpring(isDay ? 0 : 1, { frequency: 10 });

    useEffect(() => {
        if (isDay) {
            setDayMusicOrigin(DAY_MUSICS[math.random(0, DAY_MUSICS.size() - 1)]);
        } else {
            setNightMusicOrigin(NIGHT_MUSICS[math.random(0, NIGHT_MUSICS.size() - 1)]);
        }
    }, [isDay]);

    useEventListener(RunService.Heartbeat, () => {
        const newIsDay = getIsDay();
        if (newIsDay === latestIsDay.current) return;
        setIsDay(newIsDay);
    });

    return (
        <>
            <Music
                soundId={dayMusicOrigin.SoundId}
                volume={lerpBinding(dayMusicVolume, 0, dayMusicOrigin.Volume)}
                speed={dayMusicOrigin.PlaybackSpeed}
            />
            <Music
                soundId={nightMusicOrigin.SoundId}
                volume={lerpBinding(nightMusicVolume, 0, nightMusicOrigin.Volume)}
                speed={nightMusicOrigin.PlaybackSpeed}
            />
        </>
    );
}
