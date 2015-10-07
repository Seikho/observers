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
        expect(object.subscribe.bind(object.subscribe, (function (x) { return null; }))).to.not.throw;
    });
    it('will not accept a subscriber that is not a function', function () {
        expect(object.subscribe.bind(object.subscribe, 'not a function')).to.throw;
    });
    it('will not accept a non-array type', function () {
        expect(object.bind(object, 'not a function')).to.throw;
    });
    it('will accept an array type', function () {
        expect(object.bind(object, ['1', '2', '3'])).to.not.throw;
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
});
//# sourceMappingURL=index.js.map