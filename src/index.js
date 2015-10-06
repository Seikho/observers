var _this = this;
function observe(object) {
    return Observable(object);
}
exports.observe = observe;
var Observable = function (val) {
    var value = val;
    var subscribers = [];
    var getset;
    getset = function (newValue) {
        if (newValue === undefined)
            return value;
        value = newValue;
        subscribers.forEach(function (fn) { return fn(newValue); });
    };
    getset.subscribe = function (fn) {
        if (typeof fn !== 'function')
            throw new Error('Subscriber is not a function');
        subscribers.push(fn);
    };
    getset.removeSubscribers = function () { return _this.subscribers = []; };
    return getset;
};
//# sourceMappingURL=index.js.map