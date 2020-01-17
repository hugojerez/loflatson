# Loflatson
Lodash + Flatten + Unflatten + JSON safe coding

```javascript
const loflatson = require('loflatson')


loflatson.flat({a:{a:1},b:2,c:3})
// output { 'a.a': 1, b: 2, c: 3 }

loflatson.unflat({ 'a.a': 1, b: 2, c: 3 })
// output { a: { a: 1 }, b: 2, c: 3 }

loflatson.decode('{"badJSONSyntax":"abcde')
// output

loflatson.encode('hello')
// output "hello"

loflatson.chain('{"a":123}').decode().get('a').value()
// output 123

```