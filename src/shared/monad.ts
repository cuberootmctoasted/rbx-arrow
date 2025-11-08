export class Monad<T> {
    private value: T;
    constructor(value: T) {
        this.value = value;
    }
    public bind<TReturn>(binder: (value: T) => TReturn): Monad<TReturn> {
        return new Monad<TReturn>(binder(this.value));
    }
    public get(): T {
        return this.value;
    }
}

// uhhh, please don't hate it here, it's the most simplest version of monad you could ask from
// personally I just underst monad as a way to write declarative code that looks imperative-ish
