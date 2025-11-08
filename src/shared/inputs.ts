import Sift from "@rbxts/sift";

// where the definition for inputs are defined
// preferrably all client server communications are defined here
export interface Inputs {
    moveDirection?: Vector2;
    jump?: true;
}

let inputs: Inputs = {};

// updating an input meaning that one input might override another, this is the function where the inputs should be overridden
function reconcileInputs(pendingInputs: Inputs) {}

export function updateInputs(callback: (inputs: Inputs) => void) {
    const newInputs = Sift.Dictionary.copy(inputs);
    callback(newInputs);
    reconcileInputs(newInputs);
    inputs = newInputs;
}

export function getInputs() {
    return inputs as Readonly<Inputs>;
}
