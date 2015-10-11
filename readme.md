### Observers
A light implementation of JavaScript observables



[![NPM version](http://img.shields.io/npm/v/observers.svg?style=flat)](https://www.npmjs.org/package/observers)
[![Travis build status](https://travis-ci.org/Seikho/observers.svg?branch=master)](https://travis-ci.org/Seikho/observers)

### Installation
```
npm install observers --save
```

### Sample

```javascript
import obs = require('observers');

var obj = obs.observe({ key: 'value' });
assert(obj().key === 'value');

obj.subscribe(val => assert(val.key === 'newvalue'));
obj({ key: 'newvalue' }); 


var array = obs.observeArray(['a', 'b', 'c']);

assert(array.join('') === 'abc');

array.push('d');

array.find(v => v === 'a'); // 'a'

array.findIndex(v => v === 'd'); // 3

array.filter(v => v < 'c'); // '['a', 'b']

array.map(v => v === 'd' ? 'e' : v); // ['a', 'b', 'c', 'e']

array.remove(v => v > 'c'); // ['a', 'b', 'c']

// ...

```

### API

#### observe
```javascript
function <T>observe(value?: T): Observable<T>;

// Example
var anObservable = obs.observe(5);
var another = obs.observe(5);
another(7);
```

#### observeArray
```javascript
function <T>observeArray(values?: Array<T>): ObservableArray<T>;

// Example
var obsArray = obs.observeArray([1,2,3,4,5,6]);
```

#### computed
```javascript
function <T>computed(evaluator: () => T): Computed<T>;

// Example (using above example values)
var comp = obs.computed(() => anObservable() + another()); // 12
comp.subscribe(value => /* do something */);
another(9); // Will fire the above subscriber function 
```

### Shared functions
All observables (`Obervable`, `ObservableArray`, `Computed`) have the following functions:

#### getter
Returns the current value of an observable with no side effects
```javascript
function (): any;

// Example
var someNumber = obs.observe(12);
someNumber(); // Returns 12 with no side effects
```

#### subscribe
Takes a function that will be called with the new value of an observable
```javascript
function subscribe(func: (newValue: T) => void): void;

// Example
someComputed.subscribe(newValue => $.post('/api/something', { data: newValue });
```

#### removeSubscribers
Remove all listener functions on a specific observable.  
*Warning*: May have undesirable side effects.
```javascript
function removeSubscribers();

// Example
someObservable.removeSubscribers();
```

### Supported array functions

#### every
```javascript
function every(predicate: (value: T) => boolean): boolean;
```
#### find
```javascript
function find(predicate: (value: T) => boolean): T;
```
#### findIndex
```javascript
function findIndex(predicate: (value: T) => boolean): number;
```
#### filter
```javascript
function filter(predicate: (value: T) => boolean): Array<T>;
```
#### join
```javascript
function join(seperator?: string): string;
```

#### map
```javascript
function map(predicate: (value: T) => any): Array<any>;
```
#### pop
```javascript
function pop(): T;
```

#### push
```javascript
function push(value: T): number;
```

#### reverse
```javascript
function reverse(): Array<T>;
```

#### reduce
```javascript
function reduce(predicate: (previous: U, current: T, index: number, array: Array<T>) => U): U;
```

#### remove
Returns an array of the removed items
```javascript
function remove(predicate: (value: T) => boolean): Array<T>;
```

#### removeAll
Returns an array of the removed items
```javascript
function removeAll(): Array<T>;
```

#### removeSubscribers
Clears the list of subscribers
```javascript
function removeSubscribers(): void;
```

#### shift
```javascript
function shift(): number;
```

#### slice
```javascript
function slice(start?: number, end?: number): Array<T>;
```

#### sort
```javascript
function sort(comparer: (left: T, right: T) => number|boolean): Array<T>;
```

#### splice
```javascript
function splice(start?: number, end?: number): Array<T>;
```

#### subscribe
Subscribes to changes to the observable
```javascript
function subscribe(callback: (newValue: Array<T>) => void): void;
```

#### some
```javascript
function some(predicate: (value: T) => boolean): boolean;
```

#### unshift
```javascript
function unshift(...values: T[]): number;
```

#### update
Returns the `newValue` if successful.  
Returns `undefined` if unsuccessful.
```javascript
function update(predicate: (value: T) => boolean, newValue: T): T;
```