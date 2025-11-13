import { Players } from "@rbxts/services";
import { start } from "shared/start";

if (!game.IsLoaded()) {
    game.Loaded.Wait();
}

start();
