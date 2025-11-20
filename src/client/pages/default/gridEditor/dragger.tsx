import { Entity, world } from "@rbxts/covenant";
import { getBindingValue, useBindingListener, useLatest } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo, useReducer, useRef, useState } from "@rbxts/react";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { useComponent } from "client/hooks/useComponent";
import { clientState } from "shared/clientState";
import { ERR_1, OK_1 } from "shared/constants/themes";
import { covenant } from "shared/covenant";
import { CGrid, CModel, IdPlacement } from "shared/covenant/components/_list";
import { entityParts } from "shared/covenant/entityParts";
import { ItemName, Items } from "shared/datas/items";
import { getPlacementCf } from "shared/datas/placement";
import { getPvPrimaryPart } from "shared/utils/pvUtils";
import { syncedTime } from "shared/utils/syncedTime";

function setModelTransparency(model: PVInstance, transparency: number) {
    if (model.IsA("BasePart")) {
        model.Transparency = transparency;
        model.CanCollide = false;
    }
    model
        .GetDescendants()
        .filter((instance) => instance.IsA("BasePart"))
        .forEach((part) => {
            part.CanCollide = false;
            part.Transparency = transparency;
        });
}

function setModelColor(model: PVInstance, color: Color3) {
    if (model.IsA("BasePart")) {
        model.CanCollide = false;
        model.Color = color;
    }
    model
        .GetDescendants()
        .filter((instance) => instance.IsA("BasePart"))
        .forEach((part) => {
            part.CanCollide = false;
            part.Color = color;
        });
}

export function Dragger({
    grid,
    itemGuid,
    itemName,
}: {
    grid: Entity;
    itemGuid: string;
    itemName: ItemName;
}) {
    const cGrid = useComponent(grid ?? (-1 as Entity), CGrid);
    const gridPv = useComponent(grid ?? (-1 as Entity), CModel);
    const mouse = useMemo(() => {
        return Players.LocalPlayer.GetMouse();
    }, []);
    const [hoveringPosition, setHoveringPosition] = useBinding<Vector2>(Vector2.zero);

    const hoveringAbsoluteCf = hoveringPosition.map((v) => {
        if (gridPv === undefined) return CFrame.identity;
        const cf = gridPv.GetPivot();
        return getPlacementCf(cf, v);
    });

    const model = useMemo(() => {
        const p = Items[itemName].origin.Clone();
        p.Parent = Workspace;
        getPvPrimaryPart(p)!.Anchored = true;
        setModelTransparency(p, 0.5);
        return p;
    }, [itemName]);

    const [canPlace, setCanPlace] = useState(true);
    const latestCanPlace = useLatest(canPlace);

    useEffect(() => {
        const extentSize = model.IsA("Model")
            ? model.GetExtentsSize()
            : model.IsA("BasePart")
              ? model.ExtentsSize
              : Vector3.zero;
        const params = new OverlapParams();
        params.FilterType = Enum.RaycastFilterType.Exclude;
        params.AddToFilter(model);
        const connection = RunService.Heartbeat.Connect(() => {
            const parts = Workspace.GetPartBoundsInBox(model.GetPivot(), extentSize);
            let willCanPlace = true;
            parts.forEach((part) => {
                if (!willCanPlace) return;
                const e = entityParts.get(part);
                if (e === undefined) return;
                if (!covenant.worldHas(e, IdPlacement)) return;
                willCanPlace = false;
            });
            if (willCanPlace && !latestCanPlace.current) {
                setCanPlace(true);
            }
            if (!willCanPlace && latestCanPlace.current) {
                setCanPlace(false);
            }
        });

        return () => {
            connection.Disconnect();
        };
    }, [model]);

    useBindingListener(hoveringPosition, (pos) => {
        clientState.draggerData.position = pos;
    });

    useEffect(() => {
        clientState.draggerData.guid = itemGuid;
    }, [itemGuid]);

    useEffect(() => {
        if (!canPlace) return;
        const connection = mouse.Button1Down.Connect(() => {
            clientState.inputs.place = syncedTime();
        });
        return () => {
            connection.Disconnect();
        };
    }, [canPlace, itemGuid]);

    useEffect(() => {
        if (canPlace) {
            setModelColor(model, OK_1);
        } else {
            setModelColor(model, ERR_1);
        }
    }, [canPlace, model]);

    useEffect(() => {
        return () => {
            model.Destroy();
        };
    }, [itemName]);

    const latestGridPv = useLatest(gridPv);
    useBindingListener(hoveringAbsoluteCf, (v) => {
        if (latestGridPv.current === undefined) return;
        model.PivotTo(v);
    });

    const temp = useRef(Vector3.zero);

    useEffect(() => {
        if (gridPv === undefined) return;
        if (cGrid === undefined) return;

        const connection = RunService.Heartbeat.Connect(() => {
            const targetPosition = mouse.Hit.Position;
            if (RunService.IsStudio()) {
                // drawLine(targetPosition, temp.current);
            }
            temp.current = targetPosition;
            const startCf = gridPv.GetPivot();
            const hoveringPositionRaw = startCf.PointToObjectSpace(targetPosition);
            const newHoveringPosition = new Vector2(
                math.clamp(hoveringPositionRaw.X, cGrid.size.X / -2, cGrid.size.X / 2),
                math.clamp(hoveringPositionRaw.Z, cGrid.size.Y / -2, cGrid.size.Y / 2),
            );
            if (newHoveringPosition === getBindingValue(hoveringPosition)) return;
            setHoveringPosition(newHoveringPosition);
        });

        return () => {
            connection.Disconnect();
        };
    }, [gridPv]);

    return <></>;
}
