import obs = require('../src');
import chai = require('chai');

var expect = chai.expect;

describe('observable object tests', () => {

    var object = obs.observe('value');

    it('will return a function', () => {
        expect(typeof object).to.equal('function');
    });

    it('will accept a subscriber', () => {
        expect(object.subscribe.bind(object.subscribe, (x => typeof x === 'string'))).to.not.throw();
    });

    it('will not accept a subscriber that is not a function', () => {
        expect(object.subscribe.bind(object.subscribe, 'not a function')).to.throw();
    });

    it('will notify subscribers', done => {
        object.removeSubscribers();
        object.subscribe(val => {
            expect(val).to.equal('newvalue');
            done();
        });
        object('newvalue');
    });

    it('will return the current value', () => {
        expect(object()).to.equal('newvalue');
    });
});

describe('observable array tests', () => {

    var object = obs.observeArray<string>([]);

    beforeEach(() => {
        object.removeSubscribers();
    });

    it('will return a function', () => {
        expect(typeof object).to.equal('function');
    });

    it('will accept a subscriber', () => {
        expect(object.subscribe.bind(object.subscribe, (x => null))).to.not.throw();
    });

    it('will not accept a subscriber that is not a function', () => {
        expect(object.subscribe.bind(object.subscribe, 'not a function')).to.throw();
    });

    it('will not accept a non-array type', () => {
        expect(object.bind(object, 'not a function')).to.throw();
    });

    it('will accept an array type', () => {
        expect(object.bind(object, ['1', '2', '3'])).to.not.throw();
    });

    it('will notify subscribers', done => {
        object.subscribe(x => {
            expect(x.join('')).to.equal('abc');
            done();
        });

        object(['a', 'b', 'c']);
    });

    it('will pop and notify', done => {
        object(['a', 'b', 'c']);
        object.subscribe(x => {
            expect(x.join('')).to.equal('ab');
            done();
        });

        expect(object.pop()).to.equal('c');
    });

    it('will push and notify', done => {
        object(['a', 'b', 'c']);

        object.subscribe(x => {
            expect(x.join('')).to.equal('abcd');
            done();
        });

        expect(object.push('d')).to.equal(4);
    });

    it('will shift and notify', done => {

        object.subscribe(x => {
            expect(x.join('')).to.equal('bcd');
            done();
        });

        expect(object.shift()).to.equal('a');

    });

    it('will unshift and notify', done => {

        object.subscribe(x => {
            expect(x.join('')).to.equal('azbcd');
            done();
        });

        expect(object.unshift('a', 'z')).to.equal(5);
    });

    it('will find a value', () => {
        expect(object.find(x => x === 'a')).to.equal('a');
    });

    it('will replicate findIndex', () => {
        expect(object.findIndex(x => x === 'a')).to.equal(0);
    });

    it('will return -1 from findIndex if it fails to find', () => {
        expect(object.findIndex(x => x === 'unfindable')).to.equal(-1);
    });

    it('will filter for a value', () => {
        expect(object.filter(x => x < 'c').join('')).to.equal('ab');
    });

    it('will replicate .some', () => {
        expect(object.some(x => x === 'q')).to.be.false;
        expect(object.some(x => x === 'z')).to.be.true;
    });

    it('will replicate .every', () => {
        expect(object.every(x => x <= 'z')).to.be.true;
        expect(object.every(x => x === 'z')).to.be.false;
    });

    it('will replicate .map', () => {
        object(['a', 'b', 'c']);

        var mapped = object.map(x => String.fromCharCode(x.charCodeAt(0) + 1));

        expect(mapped.join('')).to.equal('bcd');
    });

    it('will replicate .reduce', () => {
        var obj = obs.observeArray([1, 2, 3]);

        var reduced = obj.reduce((prev, curr) => curr += prev, 0);

        expect(reduced).to.equal(6);
    });

    it('will replicate .reverse', () => {
        var reversed = object.reverse();
        expect(reversed.join('')).to.equal('cba');
    });

    it('will replicate .splice', () => {
        var obj = obs.observeArray([1, 2, 3, 4]);

        expect(obj.splice(1, 1).join('')).to.equal('2');
        expect(obj.join('')).to.equal('134');
    });

    it('will remove elements', () => {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);

        expect(obj.remove(x => x < 3).join('')).to.equal('12');
        expect(obj.join('')).to.equal('345');
    });

    it('will remove all elements', () => {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);

        expect(obj.removeAll().join('')).to.equal('12345');
        expect(obj.join('')).to.equal('');
    });

    it('will update an object and notify', done => {
        var obj = obs.observeArray(['blue', 'green', 'yellow']);

        obj.subscribe(arr => {
            expect(arr[0]).to.equal('orange');
            done();
        });

        obj.update(x => x === 'blue', 'orange');
    });

    it('will return undefined when update target cannot be found', () => {
        var obj = obs.observeArray(['a', 'b', 'c']);

        expect(obj.update(x => x === 'd', 'new value')).to.equal(undefined);
        expect(obj.join('')).to.equal('abc');
    });

    it('will replicate .sort', () => {
        var obj = obs.observeArray([1, 2, 3, 4, 5]);

        obj.sort((l, r) => l < r ? 1 : (l > r ? -1 : 0));
        expect(obj.join('')).to.equal('54321');
        obj.sort((l, r) => l > r ? 1 : (l < r ? -1 : 0));
        expect(obj.join('')).to.equal('12345');
    });

});

describe('computed observable tests', () => {

    it('will compute with non-observables', () => {
        var x = 1;
        var y = 2;
        var comp = obs.computed(() => x + y);
        expect(comp()).to.equal(3);

        x = 2;
        expect(comp()).to.equal(3);
    });

    it('will compute with observables', () => {
        var x = obs.observe(1);
        var y = obs.observe(2);
        var comp = obs.computed(() => x() + y());
        expect(comp()).to.equal(3);
        x(2);

        expect(comp()).to.equal(4);
    });

    it('will notify when dependent observables change', done => {
        var x = obs.observe(1);
        var y = obs.observe(2);

        var comp = obs.computed(() => x() + y());
        comp.subscribe(val => {
            expect(val).to.equal(4);
            done();
        });

        x(2);
    });

    it('will compute with computed observables', () => {
        var x = obs.observe(2);
        var y = obs.observe(4);
        var c1 = obs.computed(() => x() + y());

        var z = obs.observe(6);
        var c2 = obs.computed(() => c1() + z());
        expect(c2()).to.equal(12);

        x(4);
        expect(c2()).to.equal(14);

        z(8);
        expect(c2()).to.equal(16);

    });

    it('will notify when dependent computed values change', done => {
        var x = obs.observe(2);
        var y = obs.observe(4);
        var c1 = obs.computed(() => x() + y());

        var z = obs.observe(6);
        var c2 = obs.computed(() => c1() + z());
        
        c2.subscribe(val => {
            expect(val).to.equal(14);
            done();
        });
        
        x(4);        
    });
    
    it('will compute with computed arrays', () => {
       var x = obs.observeArray([1,2,3]);
       var c = obs.computed(() => x().join(''));
       x.push(4);
       expect(c()).to.equal('1234');       
    });
    
    it('will notify when dependent computer arrays change', done => {
        var x = obs.observeArray([1,2,3,4]);
        var c = obs.computed(() => x().reduce((prev, curr) => prev += curr, 0));
        
        c.subscribe(val => {
           expect(val).to.equal(15);
           done(); 
        });
        
        x.push(5);        
    });

});
