function observe(object) {
    return Observable(object);
}
exports.observe = observe;
function observeArray(object) {
    return ObservableArray(object);
}
exports.observeArray = observeArray;
var Observable = function (val) {
    var value = val;
    var subscribers = [];
    var obs;
    obs = function (newValue) {
        if (newValue === undefined)
            return value;
        value = newValue;
        subscribers.forEach(function (fn) { return fn(newValue); });
    };
    obs.subscribe = function (fn) {
        if (typeof fn !== 'function')
            throw new Error('Subscriber is not a function');
        subscribers.push(fn);
    };
    obs.removeSubscribers = function () { return subscribers = []; };
    return obs;
};
var ObservableArray = function (vals) {
    var array = vals;
    var subscribers = [];
    var notify = function () { return subscribers.forEach(function (fn) { return fn(array); }); };
    var call = function (mutator, value) {
        var result = array[mutator](value);
        notify();
        return result;
    };
    var apply = function (mutator, value) {
        var result = Array.prototype[mutator].apply(array, value);
        notify();
        return result;
    };
    var obs;
    obs = function (newValues) {
        if (newValues === undefined)
            return array;
        if (!Array.isArray(newValues))
            throw new Error('Value is not an array');
        array = newValues;
        notify();
    };
    obs.subscribe = function (fn) {
        if (typeof fn !== 'function')
            throw new Error('Subscriber is not a function');
        subscribers.push(fn);
    };
    obs.removeSubscribers = function () { return subscribers = []; };
    obs.push = function (value) { return call('push', value); };
    obs.pop = function () { return call('pop'); };
    obs.shift = function () { return call('shift'); };
    obs.unshift = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i - 0] = arguments[_i];
        }
        return apply('unshift', values);
    };
    obs.reverse = function () { return array.reverse(); };
    obs.find = function (predicate) { return array.filter(predicate)[0]; };
    obs.filter = function (predicate) { return array.filter(predicate); };
    obs.map = function (predicate) { return array.map(predicate); };
    obs.some = function (predicate) { return array.some(predicate); };
    obs.reduce = function (predicate, initialValue) { return array.reduce(predicate, initialValue); };
    obs.join = function (seperator) { return array.join(seperator); };
    obs.slice = function (start, end) { return array.slice(start, end); };
    obs.splice = function (start, end) {
        var result = array.splice(start, end);
        notify();
        return result;
    };
    obs.remove = function (predicate) {
        var removedItems = array.filter(predicate);
        var newArray = array.filter(function (value, index, arr) { return !predicate(value, index, arr); });
        obs(newArray);
        return removedItems;
    };
    obs.removeAll = function () {
        var removedItems = array.slice();
        obs([]);
        return removedItems;
    };
    obs.every = function (predicate) { return array.every(predicate); };
    return obs;
};
//# sourceMappingURL=index.js.map