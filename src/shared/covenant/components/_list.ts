import { covenant } from "../covenant";
import { Page } from "shared/pages";
import { PlayerSave } from "../playerSave";
import { Entity } from "@rbxts/covenant";
import { ItemName } from "shared/datas/items";

export const CLocalRepFocus = covenant.worldComponent<true>();
export const CModel = covenant.worldComponent<PVInstance>();
export const CPage = covenant.worldComponent<Page>();
export const CPlayerSave = covenant.worldComponent<PlayerSave>();
export const IdPlayer = covenant.worldComponent<Player>();
export interface RepFocusData {
    part?: BasePart;
    player: Player;
}
export const IdRepFocus = covenant.worldComponent<RepFocusData>();

export const CInputGoToIsland = covenant.worldComponent<number>();
export const CInputGoToLobby = covenant.worldComponent<number>();
export const CInputPlace = covenant.worldComponent<{ position: Vector2; guid: string }>();

export const IdGrid = covenant.worldComponent<{ data?: PVInstance }>();
export const CGrid = covenant.worldComponent<{ size: Vector2; ownerServerEntity?: Entity }>();

export const CInventory = covenant.worldComponent<ReadonlyMap<string, ItemName>>();

export const IdPlacement = covenant.worldComponent<{
    gridServerEntity: Entity;
    position: Vector2;
    itemName: ItemName;
}>();

export const CLoaded = covenant.worldComponent<true>();

export const CWillPlay = covenant.worldComponent<true>();

export const IdRoundSystem = covenant.worldComponent<true>();
export const CRoundSystem = covenant.worldComponent<{
    roundEnd?: number;
    intermissionEnd?: number;
    loadingIntermission?: boolean;
    loadingRound?: boolean;
}>();

export const CInRound = covenant.worldComponent<{ gridServerEntity: Entity }>();
