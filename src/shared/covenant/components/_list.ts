import { covenant } from "../covenant";
import { Page } from "shared/pages";
import { PlayerSave } from "../playerSave";
import { Entity } from "@rbxts/covenant";
import { ItemName } from "shared/datas/items";

export const CLocalRepFocus = covenant.worldComponent<true>("CLocalRepFocus");
export const CModel = covenant.worldComponent<PVInstance>("CModel");
export const CPage = covenant.worldComponent<Page>("CPage");
export const CPlayerSave = covenant.worldComponent<PlayerSave>("CPlayerSave");
export const IdPlayer = covenant.worldComponent<Player>("IdPlayer");
export interface RepFocusData {
    part?: BasePart;
    player: Player;
}
export const IdRepFocus = covenant.worldComponent<RepFocusData>("IdRepFocus");

export const CInputGoToIsland = covenant.worldComponent<number>("CInputGoToIsland");
export const CInputGoToLobby = covenant.worldComponent<number>("CInputGoToLobby");
export const CInputPlace = covenant.worldComponent<{ position: Vector2; guid: string }>(
    "CInputPlace",
);
export const CInputPlay = covenant.worldComponent<number>("CInputPlay");
export const CInputStartRound = covenant.worldComponent<number>("CInputStartRound");

export const IdGrid = covenant.worldComponent<{ data?: PVInstance }>("IdGrid");
export const CGrid = covenant.worldComponent<{ size: Vector2 }>("CGrid");
export const COwnedByGrid = covenant.worldComponent<{ ownerServerEntity: Entity }>("COwnedByGrid");
export const COwnedGrid = covenant.worldComponent<{ gridServerEntity: Entity }>("COwnedGrid");

export const CInventory = covenant.worldComponent<ReadonlyMap<string, ItemName>>("CInventory");

export const IdPlacement = covenant.worldComponent<{
    gridServerEntity: Entity;
    position: Vector2;
    itemName: ItemName;
}>("IdPlacement");

export const CLoaded = covenant.worldComponent<true>("CLoaded");

export const CWillPlay = covenant.worldComponent<true>("CWillPlay");

export const CPlace = covenant.worldComponent<"lobby" | "island">("CPlace");

export const CInRound = covenant.worldComponent<{ gridServerEntity: Entity }>("CInRound");

export const CGridRound = covenant.worldComponent<{ endTime: number }>("CGridRound");
