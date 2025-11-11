export function path<T extends keyof Objects>(parent: Instance, dir: string, className: T) {
    const dirRemaining = dir.split("/").filter((raw) => raw.size() > 0);
    let current = parent;
    let nextName;
    while (true) {
        nextName = dirRemaining.shift();
        if (nextName === undefined) break;
        let found = false;
        task.delay(5, () => {
            if (found) return;
            error(`Path not found: ${parent.Name}/${dir}`);
        });
        current = current.WaitForChild(nextName);
        found = true;
    }

    assert(current.IsA(className));
    return current;
}
