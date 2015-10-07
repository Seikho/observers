import * as Obs from '../index.d.ts';

export function observe<T>(object?: T) {
    return Observable<T>(object);
}

export function observeArray<T>(object?: T[]) {
    return ObservableArray<T>(object);
}

var Observable = <T>(val: T): Obs.Observable<T> => {
    var value = val;
    var subscribers: Obs.Subscriber<T>[] = [];

    var obs: any;

    obs = (newValue?: T) => {
        if (newValue === undefined) return value;

        value = newValue;
        subscribers.forEach(fn => fn(newValue));
    }

    obs.subscribe = (fn: (newValue: T) => void) => {
        if (typeof fn !== 'function')
            throw new Error('Subscriber is not a function');

        subscribers.push(fn);
    }

    obs.removeSubscribers = () => this.subscribers = [];

    return obs;
}

var ObservableArray = <T>(vals: Array<T>): Obs.ObservableArray<T> => {
    var array = vals;
    var subscribers: Obs.Subscriber<T[]>[] = [];

    var notify = () => subscribers.forEach(fn => fn(array));
    
    var mutate = (mutator: string, value?: any) => {
        var result = array[mutator](value);
        notify();
        return result;
    }
    
    var obs: any;    
    

    obs = (newValues?: Array<T>) => {
        if (newValues === undefined) return array;

        if (!Array.isArray(newValues))
            throw new Error('Value is not an array');

        array = newValues;
        notify();
    }
    
    obs.push = (value: T) => mutate('push', value);
    
    obs.pop = () => mutate('pop');
    
    obs.shift = () => mutate('shift');
    
    obs.unshift = (...values: T[]) => mutate.apply(['unshift', values]);
    
    obs.reverse = () => array.reverse();
    
    obs.find = (predicate: Obs.Predicate<T, boolean>) => array.filter(predicate)[0];
    
    obs.filter = (predicate: Obs.Predicate<T, boolean>) => array.filter(predicate);
    
    obs.map = (predicate: Obs.Predicate<T, any>) => array.map(predicate);
    
    obs.some = (predicate: Obs.Predicate<T, boolean>) => array.some(predicate);
    
    obs.reduce = <U>(predicate: Obs.Reduce<T, U>, initialValue?: U) => array.reduce(predicate, initialValue);

    obs.join = (seperator?: string) => array.join(seperator);
    
    obs.slice = (start?: number, end?: number) => array.slice(start, end);
        
    return obs; 
}