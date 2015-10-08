var obs = require('../src');
var chai = require('chai');
var expect = chai.expect;
describe('observable object tests', function () {
    var object = obs.observe('value');
    it('will return a function', function () {
        expect(typeof object).to.equal('function');
    });
    it('will accept a subscriber', function () {
        expect(object.subscribe.bind(object.subscribe, (function (x) { return typeof x === 'string'; }))).to.not.throw;
    });
    it('will not accept a subscriber that is not a function', function () {
        expect(object.subscribe.bind(object.subscribe, 'not a function')).to.throw;
    });
    it('will notify subscribers', function (done) {
        object.removeSubscribers();
        object.subscribe(function (val) {
            expect(val).to.equal('newvalue');
            done();
        });
        object('newvalue');
    });
    it('will return the current value', function () {
        expect(object()).to.equal('newvalue');
    });
});
describe('observable array tests', function () {
    var object = obs.observeArray([]);
    beforeEach(function () {
        object.removeSubscribers();
    });
    it('will return a function', function () {
        expect(typeof object).to.equal('function');
    });
    it('will accept a subscriber', function () {
        expect(object.subscribe.bind(object.subscribe, (function (x) { return null; }))).to.not.throw();
    });
    it('will not accept a subscriber that is not a function', function () {
        expect(object.subscribe.bind(object.subscribe, 'not a function')).to.throw();
    });
    it('will not accept a non-array type', function () {
        expect(object.bind(object, 'not a function')).to.throw();
    });
    it('will accept an array type', function () {
        expect(object.bind(object, ['1', '2', '3'])).to.not.throw();
    });
    it('will notify subscribers', function (done) {
        object.subscribe(function (x) {
            expect(x.join('')).to.equal('abc');
            done();
        });
        object(['a', 'b', 'c']);
    });
    it('will pop and notify', function (done) {
        object(['a', 'b', 'c']);
        object.subscribe(function (x) {
            expect(x.join('')).to.equal('ab');
            done();
        });
        expect(object.pop()).to.equal('c');
    });
    it('will push and notify', function (done) {
        object(['a', 'b', 'c']);
        object.subscribe(function (x) {
            expect(x.join('')).to.equal('abcd');
            done();
        });
        expect(object.push('d')).to.equal(4);
    });
    it('will shift and notify', function (done) {
        object.subscribe(function (x) {
            expect(x.join('')).to.equal('bcd');
            done();
        });
        expect(object.shift()).to.equal('a');
    });
    it('will unshift and notify', function (done) {
        object.subscribe(function (x) {
            expect(x.join('')).to.equal('azbcd');
            done();
        });
        expect(object.unshift('a', 'z')).to.equal(5);
    });
    it('will find a value', function () {
        expect(object.find(function (x) { return x === 'a'; })).to.equal('a');
    });
    it('will replicate findIndex', function () {
        expect(object.findIndex(function (x) { return x === 'a'; })).to.equal(0);
    });
    it('will return -1 from findIndex if it fails to find', function () {
        expect(object.findIndex(function (x) { return x === 'unfindable'; })).to.equal(-1);
    });
    it('will filter for a value', function () {
        expect(object.filter(function (x) { return x < 'c'; }).join('')).to.equal('ab');
    });
    it('will replicate .some', function () {
        expect(object.some(function (x) { return x === 'q'; })).to.be.false;
        expect(object.some(function (x) { return x === 'z'; })).to.be.true;
    });
    it('will replicate .every', function () {
        expect(object.every(function (x) { return x <= 'z'; })).to.be.true;
        expect(object.every(function (x) { return x === 'z'; })).to.be.false;
    });
    it('will replicate .map', function () {
        object(['a', 'b', 'c']);
        var mapped = object.map(function (x) { return String.fromCharCode(x.charCodeAt(0) + 1); });
        expect(mapped.join('')).to.equal('bcd');
    });
    it('will replicate .reduce', function () {
        var obj = obs.observeArray([1, 2, 3]);
        var reduced = obj.reduce(function (prev, curr) { return curr += prev; }, 0);
        expect(reduced).to.equal(6);
    });
    it('will replicate .reverse', function () {
        var reversed = object.reverse();
        expect(reversed.join('')).to.equal('cba');
    });
    it('will replicate .splice', function () {
        var obj = obs.observeArray([1, 2, 3, 4]);
        expect(obj.splice(1, 1).join('')).to.equal('2');
        expect(obj.join('')).to.equal('134');
    });
    it('will remove elements', function () {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);
        expect(obj.remove(function (x) { return x < 3; }).join('')).to.equal('12');
        expect(obj.join('')).to.equal('345');
    });
    it('will remove all elements', function () {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);
        expect(obj.removeAll().join('')).to.equal('12345');
        expect(obj.join('')).to.equal('');
    });
    it('will update an object and notify', function (done) {
        var obj = obs.observeArray(['blue', 'green', 'yellow']);
        obj.subscribe(function (arr) {
            expect(arr[0]).to.equal('orange');
            done();
        });
        obj.update(function (x) { return x === 'blue'; }, 'orange');
    });
    it('will return undefined when update target cannot be found', function () {
        var obj = obs.observeArray(['a', 'b', 'c']);
        expect(obj.update(function (x) { return x === 'd'; }, 'new value')).to.equal(undefined);
        expect(obj.join('')).to.equal('abc');
    });
    it('will replicate .sort', function () {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);
        obj.sort(function (l, r) { return l < r; });
        expect(obj.join('')).to.equal('54321');
        obj.sort(function (l, r) { return l > r; });
        expect(obj.join('')).to.equal('12345');
    });
});
//# sourceMappingURL=index.js.map