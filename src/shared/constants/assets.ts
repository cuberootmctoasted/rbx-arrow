import { ReplicatedStorage } from "@rbxts/services";
import { path } from "shared/utils/path";

export const BASIC_DROPPER = path(ReplicatedStorage, "assets/models/BasicDropper", "PVInstance");
export const BASIC_COLLECTOR = path(
    ReplicatedStorage,
    "assets/models/BasicCollector",
    "PVInstance",
);
export const SMALL_CONVEYOR = path(ReplicatedStorage, "assets/models/SmallConveyor", "PVInstance");

export const DAY_MUSICS = (() => {
    const sounds = path(ReplicatedStorage, "assets/sounds", "Instance");
    return sounds
        .GetChildren()
        .filter((instance) => {
            const [result] = instance.Name.find("DayMusic");
            return result !== undefined;
        })
        .filter((instance) => instance.IsA("Sound"));
})();

export const NIGHT_MUSICS = (() => {
    const sounds = path(ReplicatedStorage, "assets/sounds", "Instance");
    return sounds
        .GetChildren()
        .filter((instance) => {
            const [result] = instance.Name.find("NightMusic");
            return result !== undefined;
        })
        .filter((instance) => instance.IsA("Sound"));
})();
