import * as Obs from '../index.d.ts';

export function observe<T>(object?: T) {
    var observable = Observable<T>(object);
    
    var calledFromComputed = !!observe.caller['computed'];
    if (calledFromComputed) {
        observable.subscribe(() => observe.caller['computed']());
    }
    
    return Observable<T>(object);
}

export function observeArray<T>(object?: T[]) {
    var observable = ObservableArray<T>(object);
    
    var calledFromComputed = !!observeArray.caller['computed'];
    if (calledFromComputed) {
        observable.subscribe(() => observeArray.caller['computed']());
    }
    
    return observable;
}

export function computed<T>(evaluator: () => T) {
    return Computed<T>(evaluator);
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

    obs.removeSubscribers = () => subscribers = [];

    return obs;
}

var ObservableArray = <T>(vals: Array<T>): Obs.ObservableArray<T> => {
    var array = vals;
    var subscribers: Obs.Subscriber<T[]>[] = [];

    var notify = () => subscribers.forEach(fn => fn(array));

    var call = (mutator: string, value?: any) => {
        var result = array[mutator](value);
        notify();
        return result;
    }

    var apply = (mutator: string, value?: any) => {
        var result = Array.prototype[mutator].apply(array, value);
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

    obs.subscribe = (fn: (newValue: T[]) => void) => {
        if (typeof fn !== 'function')
            throw new Error('Subscriber is not a function');

        subscribers.push(fn);
    }

    obs.removeSubscribers = () => subscribers = [];

    obs.push = (value: T) => call('push', value);

    obs.pop = () => call('pop');

    obs.shift = () => call('shift');

    obs.unshift = (...values: T[]) => apply('unshift', values);

    obs.reverse = () => array.reverse();

    obs.find = (predicate: Obs.Predicate<T, boolean>) => array.filter(predicate)[0];

    obs.findIndex = (predicate: Obs.Predicate<T, boolean>) => array.reduce((prev, curr, index) => prev = predicate(curr) && prev < 0 ? index : prev, -1);

    obs.filter = (predicate: Obs.Predicate<T, boolean>) => array.filter(predicate);

    obs.map = (predicate: Obs.Predicate<T, any>) => array.map(predicate);

    obs.some = (predicate: Obs.Predicate<T, boolean>) => array.some(predicate);

    obs.reduce = <U>(predicate: Obs.Reduce<T, U>, initialValue?: U) => array.reduce(predicate, initialValue);

    obs.join = (seperator?: string) => array.join(seperator);

    obs.slice = (start?: number, end?: number) => array.slice(start, end);

    obs.splice = (start?: number, end?: number) => {
        var result = array.splice(start, end);
        notify();
        return result;
    }

    obs.remove = (predicate: Obs.Predicate<T, boolean>) => {
        var removedItems = array.filter(predicate);
        var newArray = array.filter((value, index, arr) => !predicate(value, index, arr));

        obs(newArray);
        return removedItems;
    }

    obs.removeAll = () => {
        var removedItems = array.slice();
        obs([]);
        return removedItems;
    }

    obs.every = (predicate: Obs.Predicate<T, boolean>) => array.every(predicate);

    obs.update = (predicate: Obs.Predicate<T, boolean>, newValue: T) => {
        var index = obs.findIndex(predicate);
        if (index === -1) return void 0;
        
        array[index] = newValue;
        notify();
        return newValue;
    }
    
    obs.sort = (comparer: (left: T, right: T) => number) => call('sort', comparer);

    return obs;
}

var Computed = <T>(evaluator: () => T) => {
    if (typeof evaluator !== 'function')
        throw new Error('Computed evaluator must be a function');
    
    var subscribers = [];
    
    var value: Obs.Observable<T> = null;
    
    var update = () => value(evaluator());
    
    var comp: any;
    
    comp = () => evaluator();
    
    comp.subscribe = (func: (newValue: T) => void) => {
        value.subscribe(func);
    }
    
    comp.removeSubscribers = () => value.removeSubscribers();
    
    function initialize(evaluator: Function) {
        value = observe(evaluator());
    }
    
    initialize['computed'] = () => update();
    
    initialize(evaluator);
    
    return comp;   
}