export function observe<T>(object: any|any[]): Observable<T>;

export interface Observable<T> {
    (): T;
    (newValue: T): void;
    subscribe(func: (newValue: T) => void): void;
    removeSubscribers(): void; 
}

export interface Subscriber<T> {
    (object: T): void;
}