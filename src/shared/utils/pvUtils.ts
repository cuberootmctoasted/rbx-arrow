import { Make } from "@rbxts/altmake";
import { getCustomAngularVelocity, getCustomLinearVelocity } from "./memoForces";
import { Workspace } from "@rbxts/services";

const CACHED_CF = new CFrame(0, 100000, 0);

export function makeCache<T extends PVInstance>(
    instance: T,
    capacity: number,
    hardLifetimeLimit: number,
) {
    const container = Make("Folder", {
        Parent: Workspace,
        Name: "Cached-" + instance.Name,
    });

    for (let i = 0; i < capacity; i++) {
        const newInstance = instance.Clone();
        newInstance.GetDescendants().forEach((desc) => {
            if (desc.IsA("ParticleEmitter")) {
                desc.Enabled = false;
            } else if (desc.IsA("Trail")) {
                desc.Enabled = false;
            }
        });
        newInstance.Name = instance.Name + "-" + i;
        newInstance.Parent = container;
        newInstance.PivotTo(CACHED_CF);
    }

    return (cf: CFrame, parent: Instance) => {
        const instance = container.FindFirstChildWhichIsA("Instance") as T | undefined;
        assert(instance, container.Name + " ran out of caches");
        instance.Parent = parent;
        instance.PivotTo(cf);
        instance.GetDescendants().forEach((desc) => {
            if (desc.IsA("ParticleEmitter")) {
                desc.Enabled = true;
            } else if (desc.IsA("Trail")) {
                desc.Enabled = true;
            }
        });

        const returnInstance = () => {
            instance.GetDescendants().forEach((desc) => {
                if (desc.IsA("ParticleEmitter")) {
                    desc.Enabled = false;
                } else if (desc.IsA("Trail")) {
                    desc.Enabled = false;
                }
            });
            instance.Parent = container;
            instance.PivotTo(CACHED_CF);
        };

        task.delay(hardLifetimeLimit, () => {
            if (!instance.IsDescendantOf(container)) {
                returnInstance();
            }
        });

        return [instance, returnInstance];
    };
}

export function getPvPrimaryPart(pv: PVInstance) {
    return pv.IsA("BasePart") ? pv : pv.IsA("Model") ? pv.PrimaryPart : undefined;
}

export function getPvAnyPart(pv: PVInstance) {
    return pv.IsA("BasePart")
        ? pv
        : pv.IsA("Model")
          ? pv.PrimaryPart !== undefined
              ? pv.PrimaryPart
              : pv.FindFirstChildWhichIsA("BasePart")
          : undefined;
}

export function pseudoAnchor(pv: PVInstance, enabled: boolean) {
    const rootPart = getPvPrimaryPart(pv);
    if (rootPart === undefined) return;
    const linearPseudoAnchor = getCustomLinearVelocity(rootPart, "LinearPseudoAnchor", {
        RelativeTo: Enum.ActuatorRelativeTo.World,
        ForceLimitsEnabled: true,
        ForceLimitMode: Enum.ForceLimitMode.Magnitude,
        MaxForce: math.huge,
        VectorVelocity: Vector3.zero,
    });
    const angularPseudoAnchor = getCustomAngularVelocity(rootPart, "AngularPseudoAnchor", {
        RelativeTo: Enum.ActuatorRelativeTo.World,
        AngularVelocity: Vector3.zero,
        MaxTorque: math.huge,
    });

    linearPseudoAnchor.Enabled = enabled;
    angularPseudoAnchor.Enabled = enabled;
}
