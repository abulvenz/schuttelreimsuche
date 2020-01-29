import solver from "./solver";

const { keys } = Object;

const toTrie = (list) => {
    const trie = { isWord: list.some(e => e.length === 0), count: () => Object.keys(trie.words).length };
    list = list.filter(e => e.length > 0)

    const wordsByLetter =
        list.reduce((acc, word) => {
            let nList = acc[word[0]] || [];
            nList.push(word.substring(1, word.length));
            acc[word[0]] = nList;
            return acc;
        }, {});

    trie.words = {};
    Object.keys(wordsByLetter).forEach(letter => trie.words[letter] = toTrie(wordsByLetter[letter]))

    return trie;
};

const hasVowel = str => /.*[aeiou].*/ig.test(str);

console.log(hasVowel('str'))

console.log(hasVowel('strasse'))
console.log(hasVowel('b'))
console.log(hasVowel('a'))

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

const genCandidates = (trie) => {

};

const childHasCandidate = trie => Object.keys(trie.words)
    .map(w => trie.words[w]).some(e => e.canditate)

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

export default {
    create: toTrie,
    reduce,
    listCandidates
}