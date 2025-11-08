import { getBindingValue, useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import { useMemo, useRef } from "@rbxts/react";
import { LinearOptions, SpringOptions, TweenOptions } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import variantModule, { fields, TypeNames, VariantOf } from "@rbxts/variant";

// inspired by littensy

export const MotionVariantOptions = variantModule({
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    immediate: fields<{}>(),
    linear: fields<LinearOptions>(),
    tween: fields<TweenOptions>(),
    spring: fields<SpringOptions>(),
});

export type MotionVariantOptions<T extends TypeNames<typeof MotionVariantOptions> = undefined> =
    VariantOf<typeof MotionVariantOptions, T>;

export interface TransitionOptions {
    in: MotionVariantOptions;
    out: MotionVariantOptions;
}

export function useTransition(visible: boolean, options: TransitionOptions) {
    const goal = useMemo(() => (visible ? 1 : 0), [visible]);
    const direction = useMemo(() => (visible ? "in" : "out"), [visible]);
    const [binding, motion] = useMotion(goal);
    const previousGoal = useRef(goal);

    useEventListener(RunService.Heartbeat, () => {
        const currentGoal = getBindingValue(goal);

        if (currentGoal === previousGoal.current) return;
        previousGoal.current = currentGoal;

        const motionVariantOptions = getBindingValue(direction) === "in" ? options.in : options.out;
        if (motionVariantOptions.type === "immediate") {
            motion.immediate(currentGoal);
        } else if (motionVariantOptions.type === "linear") {
            motion.linear(currentGoal, motionVariantOptions);
        } else if (motionVariantOptions.type === "tween") {
            motion.tween(currentGoal, motionVariantOptions);
        } else {
            motion.spring(currentGoal, motionVariantOptions);
        }
    });

    return binding;
}
