import lodash from 'lodash';

const square = n => n * n;
const print = value => console.log(value);

print( lodash.map([4, 8], square) );
// => [16, 64]

print( lodash.map({ 'a': 4, 'b': 8 }, square) );
// => [16, 64] (iteration order is not guaranteed)

const users = [
  { 'user': 'barney' },
  { 'user': 'fred' }
];

// The `_.property` iteratee shorthand.
print( lodash.map(users, 'user') );
// => ['barney', 'fred']