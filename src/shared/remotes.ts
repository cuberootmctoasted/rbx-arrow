import { WorldChangesForPrediction, WorldChangesForReplication } from "@rbxts/covenant";
import { Client, createRemotes, remote, Server } from "@rbxts/remo";

// preferably the client server communications are handled in inputs and through replication
export const remotes = createRemotes({
    requestPayload: remote<Server>(),
    replicate: remote<Client, [WorldChangesForReplication]>(),
    predict: remote<Server, [WorldChangesForPrediction]>(),
});
