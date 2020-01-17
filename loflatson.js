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
        return FP.flow([
            FP.toPairs,
            FP.reduce((output, [key, value]) => lodash.set(output, key, value), {}),
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
        const result = lodash.attempt(JSON.parse.bind(null, obj))
        if (lodash.isError(result)) {
            return;
        } else {
            return result
        }
    }
})
module.exports = lodash
