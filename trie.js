import solver from "./solver";

const { keys } = Object;

const hasVowel = str => /.*[aeiouy].*/ig.test(str);
const use = (v, fn) => fn(v);
const flatMap = (arr, fn = e => e) => arr.reduce((acc, v) => acc.concat(fn(v)), []);
const square = (arr, fn) => flatMap(arr.map((e1, i1) => arr.map((e2, i2) => i1 > i2 ? fn(e1, e2) : null))).filter(e => e !== null)

const toTrie = list => {
    const trie = { isWord: list.some(e => e.length === 0), count: () => keys(trie.words).length };
    list = list.filter(e => e.length > 0)

    const wordsByLetter =
        list.reduce((acc, word) =>
            use(!hasVowel(word), isFrag => {
                let frag = isFrag ? word : word[0];
                let rest = isFrag ? '' : word.substring(1, word.length)
                let nList = acc[frag] || [];
                nList.push(rest);
                acc[frag] = nList;
                return acc;
            }), {});

    trie.words = {};
    keys(wordsByLetter)
        .forEach(letter => trie.words[letter] = toTrie(wordsByLetter[letter]));
    return trie;
};

const reduce = trie => {
    let i = 0;
    let changed = false;
    do {
        let resultWords = {};
        keys(trie.words)
            .forEach(word => {
                const child = trie.words[word];
                if (!child.isWord && child.count() === 1) {
                    changed = true;
                    let letter = keys(child.words)[0];
                    resultWords[word + letter] = child.words[letter];
                } else {
                    resultWords[word] = child;
                }
            });
        trie.words = resultWords;
    } while (changed && i++ < 15);

    keys(trie.words).forEach(
        word => {
            if (!hasVowel(word) && trie.words[word].isWord) {
                trie.words[word].canditate = true;
            }
        }
    )

    return keys(trie.words)
        .map(word =>
            reduce(trie.words[word])
        ).some(e => e);
};

const add = (obj, key, value) => {
    const arr = obj[key] || [];
    arr.push(value);
    obj[key] = arr;
};

const childHasCandidate = trie => Object.keys(trie.words)
    .map(w => trie.words[w]).some(e => e.canditate)


const genCandidates = (trie, wordSoFar = '', candidates = {}) => {
    if (keys(trie.words).map(
            word => {
                if (!hasVowel(word) && trie.words[word].isWord) {
                    add(candidates, word, wordSoFar);
                    return true;
                }
                return false;
            }
        ).some(e => e) && trie.isWord) {
        add(candidates, '.', wordSoFar);
    }
    keys(trie.words)
        .forEach(word => {
            let child = trie.words[word];
            genCandidates(child, wordSoFar + word, candidates);
        });
    return candidates;
};

const splitPoint = str => str
    .split('')
    .map(l => hasVowel(l))
    .find()

const listCandidates = (trie, wordSoFar = '', candidates = []) => {
    if (trie.canditate) {
        candidates.push(wordSoFar);
    } else if (trie.isWord && childHasCandidate(trie)) {
        candidates.push(wordSoFar);
    }

    trie.word = solver.reverse(wordSoFar);

    keys(trie.words)
        .forEach(word => {
            let child = trie.words[word];
            listCandidates(child, wordSoFar + word, candidates);
        });

    return candidates;
};

const search = candidates => use(keys(candidates)
    .reduce((acc, key) => {
        let list = candidates[key] || [];
        list.forEach(rest => {
            acc[rest] = acc[rest] || [];
            acc[rest].push(key)
        })
        return acc;
    }, {}), byRest => {
        let result = {};

        keys(byRest)
            .forEach(
                key => {
                    if (byRest[key].length > 1)
                        result[key] = byRest[key]
                }
            )

        return result;
    })

const shuttlerhyme = (byRest, beginnings) => {
    let rests = Object.keys(byRest) //.filter(e => e === 'agen' || e === 'egen');
    const results = [];
    rests.forEach((rest1, i1) => {
        rests.forEach((rest2, i2) => {
            if (i1 < i2) {
                let same = beginnings
                    .filter(begin => byRest[rest1].indexOf(begin) >= 0 && byRest[rest2].indexOf(begin) >= 0)

                if (same.length > 1) {
                    results.push({
                        rest1: solver.reverse(rest1),
                        rest2: solver.reverse(rest2),
                        beginnings: same.map(solver.reverse),

                        rhymes: square(same, (b1, b2) => solver.reverse(rest1 + b1 + ' ' + rest2 + b2 + ' ,' + rest1 + b2 + ' ' + rest2 + b1))
                    });
                }
            }
        })
    });
    return results;
};

export default {
    create: toTrie,
    reduce,
    listCandidates,
    genCandidates,
    search,
    shuttlerhyme
}