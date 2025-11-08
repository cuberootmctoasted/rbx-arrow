export function path<T extends keyof Objects>(parent: Instance, dir: string, className: T) {
    const dirRemaining = dir.split("/").filter((raw) => raw.size() > 0);
    let current = parent;
    let nextName;
    while (true) {
        nextName = dirRemaining.shift();
        if (nextName === undefined) break;
        current = current.WaitForChild(nextName);
    }

    assert(current.IsA(className));
    return current;
}
