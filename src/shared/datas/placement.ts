export function getPlacementCf(gridCf: CFrame, hoveringPosition: Vector2) {
    return gridCf
        .add(gridCf.LookVector.mul(-hoveringPosition.Y))
        .add(gridCf.RightVector.mul(hoveringPosition.X))
        .add(new Vector3(0, 1, 0));
}
