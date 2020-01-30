import m from 'mithril';
import { div, a, pre, ul, li, table, th, tr, td } from './tags';

import solver from './solver';
import trie from './trie';
const { keys } = Object;

let mwords = {};
let word = '';
let candidates = [];
let byRest = [];
let shuttle = [];

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
                a.button({
                    onclick: e => {
                        candidates = trie.genCandidates(mwords);
                        byRest = trie.search(candidates);
                        shuttle = trie.shuttlerhyme(byRest, keys(candidates))
                    }
                }, 'list candidates'),
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
                /*  table(
                      keys(byRest).map(rest =>
                          tr(
                              td(rest), keys(candidates).map(begin => td(byRest[rest].indexOf(begin) >= 0 ? begin : ''))
                          )
                      )
                  ),*/

                /*              ul(Object.keys(candidates).map(
                    start => li(solver.reverse(start), '- ', candidates[start].map(solver.reverse).join(', '))

                )),
*/
                pre(JSON.stringify(shuttle.map(s => s.rhymes.join(';')), null, 2))
                // pre(JSON.stringify(candidates, null, 2)),
                /* pre(JSON.stringify(mwords, null, 2)),*/
            )
        ]
    }
})