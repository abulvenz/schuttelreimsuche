const rangeIncl = (S, E) => {
    const result = [];
    for (let i = S; i <= E; i++) {
        result.push(i);
    }
    return result;
};
const unique = arr => Object.keys(arr.reduce((acc, v) => {
    acc[v] = 1;
    return acc;
}, {}));
const use = (v, f) => f(v)
const flatMap = (arr, f = e => e) => arr.reduce((acc, x) => acc.concat(f(x)), []);

const hasVowel = str => /.*[aeiouy].*/ig.test(str);
const reverse = str => str === '' ? str : (reverse(str.substring(1, str.length)) + str[0]);

export default {
    rangeIncl,
    unique,
    use,
    flatMap,
    hasVowel,
    reverse
}