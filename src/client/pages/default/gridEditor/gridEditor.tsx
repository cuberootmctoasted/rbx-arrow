import { Entity } from "@rbxts/covenant";
import React, { useMemo, useState } from "@rbxts/react";
import { useComponent } from "client/hooks/useComponent";
import { usePlayerEntity } from "client/hooks/usePlayerEntity";
import { CInventory } from "shared/covenant/components/_list";
import { Dragger } from "./dragger";
import { BG_1, FG_1 } from "shared/constants/themes";
import { ItemName, Items } from "shared/datas/items";
import { ItemFrame } from "client/components/itemFrame";

function ItemSlot({
    itemName,
    selectThisItem,
}: {
    itemName: ItemName;
    selectThisItem: () => void;
}) {
    return (
        <textbutton
            Size={new UDim2(0, 80, 0, 80)}
            BorderSizePixel={0}
            BackgroundTransparency={0.5}
            BackgroundColor3={BG_1}
            Event={{
                MouseButton1Click: () => {
                    selectThisItem();
                },
            }}
            Text={""}
        >
            <ItemFrame
                itemOrigin={Items[itemName].origin}
                lookFrom={new Vector3(0, 3, 10)}
                rotSpeed={0.2}
                position={new UDim2(0, 0, 0, 0)}
                size={new UDim2(1, 0, 0.8, 0)}
            />
            <textlabel
                Position={new UDim2(0, 0, 0.8, 0)}
                Size={new UDim2(1, 0, 0.2, 0)}
                BackgroundTransparency={1}
                BorderSizePixel={0}
                Text={Items[itemName].displayName}
                TextColor3={FG_1}
            />
        </textbutton>
    );
}

export function GridEditor({ grid }: { grid: Entity }) {
    const playerEntity = usePlayerEntity();
    const inventory = useComponent(playerEntity, CInventory);
    const [selectedItemGuid, setSelectedItemGuid] = useState<string | undefined>();

    const elements = useMemo(() => {
        const map: Map<string, React.Element> = new Map();
        inventory?.forEach((itemName, guid) => {
            map.set(
                guid,
                <ItemSlot
                    key={guid}
                    itemName={itemName}
                    selectThisItem={() => {
                        setSelectedItemGuid(guid);
                    }}
                />,
            );
        });
        return map;
    }, [inventory]);

    return (
        <>
            {selectedItemGuid !== undefined && (
                <Dragger
                    grid={grid}
                    itemGuid={selectedItemGuid}
                    itemName={inventory!.get(selectedItemGuid)!}
                />
            )}
            <frame
                BackgroundTransparency={0.5}
                BackgroundColor3={BG_1}
                BorderSizePixel={0}
                Size={new UDim2(1, 0, 0, 100)}
                Position={new UDim2(0.5, 0, 1, 0)}
                AnchorPoint={new Vector2(0.5, 1)}
            >
                <uilistlayout
                    FillDirection={"Horizontal"}
                    HorizontalAlignment={"Center"}
                    Padding={new UDim(0.1, 0.1)}
                    VerticalAlignment={"Center"}
                />
                {elements}
            </frame>
        </>
    );
}
