import { Players, ReplicatedStorage, RunService, ServerScriptService } from "@rbxts/services";
import { covenant } from "./covenant";
import { path } from "./utils/path";

export function start() {
    function traverseScripts(folder: Instance) {
        folder
            .GetDescendants()
            .filter((instance): instance is ModuleScript => instance.IsA("ModuleScript"))
            .sort((a, b) => a.GetFullName() < b.GetFullName())
            .forEach((module) => {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                require(module);
            });
    }

    const sharedFolder = path(ReplicatedStorage, "TS", "Instance");
    const relativeFolder = RunService.IsClient()
        ? path(Players.LocalPlayer, "PlayerScripts/TS", "Instance")
        : RunService.IsServer()
          ? path(ServerScriptService, "TS", "Instance")
          : new Instance("Folder");

    traverseScripts(sharedFolder);
    traverseScripts(relativeFolder);

    covenant.start();
}
