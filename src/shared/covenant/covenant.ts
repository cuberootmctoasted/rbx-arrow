import { Covenant, CovenantProps } from "@rbxts/covenant";
import { remotes } from "../remotes";

const requestPayloadSend: CovenantProps["requestPayloadSend"] = () => {
    remotes.requestPayload.fire();
};

const requestPayloadConnect: CovenantProps["requestPayloadConnect"] = (callback) => {
    remotes.requestPayload.connect(callback);
};

const replicationSend: CovenantProps["replicationSend"] = (player, worldChanges) => {
    remotes.replicate.fire(player, worldChanges);
};

const replicationSendAll: CovenantProps["replicationSendAll"] = (worldChanges) => {
    remotes.replicate.fireAll(worldChanges);
};

const replicationConnect: CovenantProps["replicationConnect"] = (callback) => {
    remotes.replicate.connect(callback);
};

const predictionSend: CovenantProps["predictionSend"] = (worldChanges) => {
    remotes.predict.fire(worldChanges);
};

const predictionConnect: CovenantProps["predictionConnect"] = (callback) => {
    remotes.predict.connect(callback);
};

export const covenant = new Covenant({
    logging: false,
    requestPayloadSend,
    requestPayloadConnect,
    replicationSend,
    replicationConnect,
    replicationSendAll,
    predictionSend,
    predictionConnect,
});
