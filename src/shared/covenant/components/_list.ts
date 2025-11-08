import { Inputs } from "shared/inputs";
import { covenant } from "../covenant";
import { Page } from "shared/pages";
import { PlayerSave } from "../playerSave";

export const CInputs = covenant.worldComponent<Readonly<Inputs>>();
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
