import m from 'mithril';
import Typo from 'typo-js';

const { sqrt, trunc, min, max } = Math;

import aff from './de-DE/de-DE.aff';
import dic from './de-DE/de-DE.dic';
import trie from './trie';

let dictionary = null;
let typo_dict = {};
let words = null;


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

const onTrack = (pathLetters, subTrie = words) => {
    if (pathLetters.length === 0)
        return subTrie;
    const next = pathLetters.shift();
    if (subTrie.words[next])
        return onTrack(pathLetters, subTrie.words[next]);
    return false;
};

const reverse = str => str === '' ? str : (reverse(str.substring(1, str.length)) + str[0]);

const reggae = new RegExp(/.*[\-äßöü\.].*]/ig);

let complete = true;

const hasVowel = str => /.*[aeiouy].*/ig.test(str);


if (complete) {


    setTimeout(() =>
        fetch(aff)
        .then(json => (json.text().then(
            aff_text => {
                fetch(dic).then(json => (json.text().then(
                    dic_text => {
                        dictionary = new Typo("de_DE", aff_text, dic_text)
                        words = trie.create(Object
                            .keys(dictionary.dictionaryTable)
                            .filter(e => e.length < 8)
                            .filter((e, i) => i < 130000)
                            .filter(e => e !== e.toUpperCase())
                            .map(e => e.toLowerCase())
                            .filter(e => hasVowel(e))
                            .filter(e => e.indexOf('-') < 0)
                            .filter(e => e.indexOf('�') < 0)
                            .filter(e => e.indexOf('ä') < 0)
                            .filter(e => e.indexOf('ß') < 0)
                            .filter(e => e.indexOf('ö') < 0)
                            .filter(e => e.indexOf('ü') < 0)
                            .filter(e => e.indexOf('.') < 0)
                            .map(e => reverse(e))
                        )
                        m.redraw();
                    }
                )))
            }))),
        200
    );
} else {
    dictionary = 'e'

    words = trie.create([
        "pflegen",
        "legen",
        "alias",
        "elias",
        "zwingen",
        "bringen",
        "zwei",
        "brei",
        "drei",
        "dringen",
        "pflaster",
        "laster",
        "tragen",
        "lagen",
        "ragen",
        "tagen",
        "behagen"
    ].map(reverse))


}
export default {
    reverse,
    words: () => words,
    ready: () => !!dictionary
}