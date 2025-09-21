const dual = require('@poc/lib-dual');

console.log('--- demo-node (CJS require) ---');
console.log('dual.shout("hi") =', dual.shout('hi'));
console.log('dual.default("x", 5, "0") =', dual.default('x', 5, '0'));

