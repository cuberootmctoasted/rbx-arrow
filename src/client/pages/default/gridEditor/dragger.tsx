import { Entity } from "@rbxts/covenant";
import { getBindingValue, useBindingListener, useLatest } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo, useReducer, useRef, useState } from "@rbxts/react";
import { Players, RunService, Workspace } from "@rbxts/services";
import { useComponent } from "client/hooks/useComponent";
import { ERR_1, OK_1 } from "shared/constants/themes";
import { CGrid, CModel } from "shared/covenant/components/_list";
import { ItemName, Items } from "shared/datas/items";
import { getPvPrimaryPart } from "shared/utils/pvUtils";

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

    const hoveringAbsolutePosition = hoveringPosition.map((v) => {
        if (gridPv === undefined) return Vector3.zero;
        const cf = gridPv.GetPivot();
        return cf.Position.add(cf.LookVector.mul(-v.Y)).add(cf.RightVector.mul(v.X));
    });

    const model = useMemo(() => {
        const p = Items[itemName].origin.Clone();
        p.Parent = Workspace;
        getPvPrimaryPart(p)!.Anchored = true;
        setModelTransparency(p, 0.5);
        return p;
    }, [itemName]);

    const [canPlace, setCanPlace] = useState(false);
    const latestCanPlace = useLatest(canPlace);

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
    useBindingListener(hoveringAbsolutePosition, (v) => {
        if (latestGridPv.current === undefined) return;
        model.PivotTo(latestGridPv.current.GetPivot().Rotation.add(v.add(new Vector3(0, 1, 0))));
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
