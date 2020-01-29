import m from 'mithril';
import { div, a, pre, ul, li } from './tags';

import solver from './solver';
import trie from './trie';

let mwords = {};
let word = '';
let candidates = [];

m.mount(document.body, {
    view: vnode => {
        return [
            div.container(
                solver.ready() ? '' + solver.words().isWord : null,
                a.button({
                    onclick: e => {
                        mwords = solver.words();
                        word = '';
                    }
                }, 'reset'),
                a.button({ onclick: e => trie.reduce(mwords) }, 'reduce'),
                a.button({ onclick: e => mwords = trie.create(trie.listCandidates(mwords)) }, 'list candidates'),
                pre(JSON.stringify(mwords.isWord)),
                mwords.words ?
                Object.keys(mwords.words).map(l => a.button({
                    onclick: e => {
                        mwords = mwords.words[l];
                        word = word + l
                    }
                }, l)) :
                null,

                solver.reverse(word),
                pre(JSON.stringify(candidates.map(solver.reverse), null, 2)),
                pre(JSON.stringify(mwords, null, 2)),
            )
        ]
    }
})