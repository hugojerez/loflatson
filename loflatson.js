// Lodash + Flatten + Unflatten + JSON safe coding

const lodash = require('lodash')
var FP = require('lodash/fp');

lodash.mixin({
    flat(input) {
        const result = {}
        const checkValue = (obj, path = '') => {
            lodash.forEach(obj, (value, index) => {
                const currentPath = path + index + '.'
                // Avoid collisions with universal packages like Moment.js
                if (lodash.isObject(value) && !lodash.get(value, '_isAMomentObject')) {
                    checkValue(value, currentPath)
                } else {
                    result[lodash.join(lodash.slice(currentPath, 0, -1), '')] = value
                }
            })
        }
        checkValue(input)
        return result
    },
    unflat(input) {
        /*
        * Unflat an object
        * The code reference can be found at:
        * https://github.com/lodash/lodash/issues/2240#issuecomment-418820848
        */
        return FP.flow([
            FP.toPairs,
            FP.reduce((output, [key, value]) => lodash.setWith(output, key, value, Object), {}),
        ])(input);
    },
    encode(obj) {
        const result = lodash.attempt(JSON.stringify.bind(null, obj))
        if (lodash.isError(result)) {
            return;
        } else {
            return result
        }
    },
    decode(obj) {
        /*
        * Safely decode an object
        * Prevents errors by returning an empty value if this occurs
        * The code reference can be found at:
        * https://gist.github.com/gucheen/12b90451f04733078d7f
        */
        const result = lodash.attempt(JSON.parse.bind(null, obj))
        if (lodash.isError(result)) {
            return;
        } else {
            return result
        }
    },
    queryString(obj) {
        // https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
        const serialize = function (obj, prefix) {
            var str = [],
                p;
            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    var k = prefix ? prefix + "[" + p + "]" : p,
                        v = obj[p];
                    str.push((v !== null && typeof v === "object") ?
                        serialize(v, k) :
                        encodeURIComponent(k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        }
        return serialize(obj)
    }
})
module.exports = lodash
