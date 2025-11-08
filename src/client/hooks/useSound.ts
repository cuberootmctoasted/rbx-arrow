import { useCallback, useMemo } from "@rbxts/react";
import { SoundService } from "@rbxts/services";

export function useSound(soundId: string, cacheSize: number = 100) {
    const cache = useMemo(() => {
        const name = "CACHE-" + soundId;
        let _cache = SoundService.FindFirstChild(name);
        if (_cache !== undefined) return _cache;

        _cache = new Instance("Folder");
        _cache.Parent = SoundService;
        _cache.Name = name;
        for (let i = 0; i < cacheSize; i++) {
            const sound = new Instance("Sound");
            sound.Name = soundId;
            sound.Parent = _cache;
            sound.SoundId = soundId;
        }
        return _cache;
    }, []);

    const play = useCallback(() => {
        const sound = cache.FindFirstChildWhichIsA("Sound");
        if (sound === undefined) return;
        sound.Parent = SoundService;
        sound.TimePosition = 0;
        sound.Play();
        sound.Ended.Once(() => {
            sound.Parent = cache;
        });
    }, [cache]);

    return play;
}
