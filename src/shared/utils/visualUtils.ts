import { Make } from "@rbxts/altmake";
import { Debris, Workspace } from "@rbxts/services";

// had help from ai

export function drawLine(
    from: Vector3,
    to: Vector3,
    width: number = 0.05,
    decayTime: number = 1,
    color: Color3 = Color3.fromRGB(255, 0, 0),
    material: Enum.Material = Enum.Material.Neon,
) {
    const distance = from.sub(to).Magnitude;
    const p = Make("Part", {
        Anchored: true,
        CanCollide: false,
        Size: new Vector3(width, width, distance),
        CFrame: CFrame.lookAt(from, to).mul(new CFrame(0, 0, -distance / 2)),

        Parent: Workspace,

        Material: material,
        Color: color,
    });

    Debris.AddItem(p, decayTime);
    return p;
}
