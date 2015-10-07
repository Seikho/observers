export function observe<T>(object?: T): Observable<T>;

export function observeArray<T>(object?: T[]): ObservableArray<T>;

export interface Observable<T> {
    (): T;
    (newValue: T): void;
    subscribe(func: (newValue: T) => void): void;
    removeSubscribers(): void;
}

export interface ObservableArray<T> extends Observable<T> {
    (): Array<T>;
    
    (newValue: Array<T>): void;
    
    find(predicate: Predicate<T, boolean>): T;
    
    filter(predicate: Predicate<T, boolean>): Array<T>;
    
    join(separator?: string): string;
    
    map(predicate: Predicate<T, any>): Array<any>;
    
    pop(): T;
    
    push(value: T): number;
    
    reverse(): Array<T>;
    
    reduce<U>(predicate: Reduce<T, U>, initialValue?: U): U;
    
    shift(): number;
    
    some(predicate: Predicate<T, boolean>): boolean;
    
    unshift(): number;
}

export interface Subscriber<T> {
    (object: T): void;
}

export interface Predicate<T, U> {
    (value: T, index?: number, array?: T[]): U;
}

export interface Reduce<T, U> {
    (previousValue: U, currentValue: T, index?: number): U;
}