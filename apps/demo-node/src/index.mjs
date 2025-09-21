import { add, math } from '@poc/lib-basic';
import defaultSum from '@poc/lib-basic/sum';
import { shout } from '@poc/lib-dual';

console.log('--- demo-node (ESM) ---');
console.log('add(2, 3) =', add(2, 3));
console.log('math.multiply(2, 3) =', math.multiply(2, 3));
console.log('sum(1, 2, 3) =', defaultSum(1, 2, 3));
console.log('shout("hello") =', shout('hello'));

