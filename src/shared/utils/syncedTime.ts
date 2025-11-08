import { Workspace } from "@rbxts/services";

// had help from ai

const UPDATE_INTERVAL = 5;
let offset = 0;
let lastResync = 0;

offset = Workspace.GetServerTimeNow() - os.clock();

export function syncedTime() {
    const t = os.clock() + offset;

    if (t - lastResync >= UPDATE_INTERVAL) {
        lastResync = t;
        task.defer(() => {
            offset = Workspace.GetServerTimeNow() - os.clock();
        });
    }

    return t;
}
