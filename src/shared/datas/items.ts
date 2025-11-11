import { ReplicatedStorage } from "@rbxts/services";
import variantModule, { fields, TypeNames, variant, VariantOf } from "@rbxts/variant";
import { BASIC_COLLECTOR, BASIC_DROPPER, SMALL_CONVEYOR } from "shared/constants/assets";
import { path } from "shared/utils/path";

export const ItemVariant = variantModule({
    dropper: fields<{ todo: true }>(),
    conveyor: fields<{ todo: true }>(),
    collector: fields<{ todo: true }>(),
    furniture: fields<{ todo: true }>(),
});

export type ItemVariant<T extends TypeNames<typeof ItemVariant> = undefined> = VariantOf<
    typeof ItemVariant,
    T
>;

export interface ItemProperty {
    displayName: string;
    origin: PVInstance;
    variant: ItemVariant;
}

const asItemProperty = (data: ItemProperty) => data;

export const Items = {
    basicDropper: asItemProperty({
        displayName: "Basic Dropper",
        origin: BASIC_DROPPER,
        variant: ItemVariant.dropper({ todo: true }),
    }),
    basicCollector: asItemProperty({
        displayName: "Basic Collector",
        origin: BASIC_COLLECTOR,
        variant: ItemVariant.collector({ todo: true }),
    }),
    smallConveyor: asItemProperty({
        displayName: "Small Conveyor",
        origin: SMALL_CONVEYOR,
        variant: ItemVariant.conveyor({ todo: true }),
    }),
};
export type ItemName = keyof typeof Items;
