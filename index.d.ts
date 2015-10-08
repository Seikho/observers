export function observe<T>(object?: T): Observable<T>;

export function observeArray<T>(object?: T[]): ObservableArray<T>;

export interface Observable<T> {
    (): T;
    (newValue: T): void;
    subscribe(func: (newValue: T) => void): void;
    removeSubscribers(): void;
}

export interface ObservableArray<T> {
    (): Array<T>;
    
    (newValue: Array<T>): void;
    
    every(predicate: Predicate<T, boolean>): boolean;
    
    find(predicate: Predicate<T, boolean>): T;
    
    findIndex(predicate: Predicate<T, boolean>): number;
    
    filter(predicate: Predicate<T, boolean>): Array<T>;
    
    join(separator?: string): string;
    
    map(predicate: Predicate<T, any>): Array<any>;
    
    pop(): T;
    
    push(value: T): number;
    
    reverse(): Array<T>;
    
    reduce<U>(predicate: Reduce<T, U>, initialValue?: U): U;
    
    remove(predicate: Predicate<T, boolean>): T[];
    
    removeAll(): T[];
    
    removeSubscribers(): void;
    
    shift(): number;
    
    slice(start?: number, end?: number): T[];
    
    splice(start?: number, end?: number): T[];
    
    subscribe(func: (newValue: T[]) => void): void;
        
    some(predicate: Predicate<T, boolean>): boolean;
    
    unshift(...values: T[]): number;
    
    update(predicate: Predicate<T, boolean>, newValue: T): T;
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