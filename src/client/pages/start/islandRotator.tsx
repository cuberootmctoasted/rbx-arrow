import { Entity } from "@rbxts/covenant";
import { useCamera, useInterval, useLatest, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useEffect, useMemo, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { PartFrame } from "client/components/partFrame";
import { useComponent } from "client/hooks/useComponent";
import { covenant } from "shared/covenant";
import { CGrid, CModel, IdGrid } from "shared/covenant/components/_list";
import { syncedTime } from "shared/utils/syncedTime";

export function IslandRotator() {
    const getNewGrid = useCallback((oldGrid: Entity) => {
        const entities: Entity[] = [];
        for (const [e] of covenant.worldQuery(CGrid, CModel)) {
            entities.push(e);
        }
        if (entities.isEmpty()) {
            return -1 as Entity;
        }
        if (entities.size() === 1) {
            return entities[0];
        }
        while (true) {
            const newGrid = entities[math.random(0, entities.size() - 1)];
            if (newGrid !== oldGrid) {
                return newGrid;
            }
        }
    }, []);

    const [grid, setGrid] = useState(getNewGrid(-1 as Entity));

    const gridModel = useComponent(grid, CModel);
    const camera = useCamera();

    useEffect(() => {
        if (gridModel === undefined) return;
        camera.CameraType = Enum.CameraType.Scriptable;
        const connection = RunService.Heartbeat.Connect(() => {
            let cf = CFrame.fromEulerAnglesYXZ(
                10,
                (syncedTime() / 20 - math.floor(syncedTime() / 20)) * math.pi * 2,
                math.pi,
            ).add(gridModel.GetPivot().Position);
            cf = cf.add(cf.LookVector.mul(-50));
            camera.PivotTo(cf);
        });
        return () => {
            connection.Disconnect();
        };
    }, [gridModel]);

    const [transparency, transparencyApi] = useMotion(1);
    const latestGrid = useLatest(grid);

    useInterval(() => {
        transparencyApi.spring(0);
        task.wait(1);
        setGrid(getNewGrid(latestGrid.current));
        transparencyApi.spring(1);
    }, 5);

    return (
        <PartFrame
            size={new Vector2(100, 100)}
            position={new Vector3(0, 0, 20)}
            orientation={new Vector3(0, 0, 0)}
            lightInfluence={0}
            pixelPerStud={50}
        >
            <frame
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={transparency}
                Size={new UDim2(1, 0, 1, 0)}
            />
        </PartFrame>
    );
}
