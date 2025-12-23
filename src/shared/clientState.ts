export interface ClientState {
    loaded: boolean;
    draggerData: {
        guid: string;
        position: Vector2;
    };
    inputs: {
        goToIsland: number;
        goToLobby: number;
        place: number;
        start: number;
    };
}

export const clientState: ClientState = {
    loaded: false,
    draggerData: {
        guid: "",
        position: Vector2.zero,
    },
    inputs: {
        goToIsland: -1,
        goToLobby: -1,
        place: -1,
        start: -1,
    },
};
