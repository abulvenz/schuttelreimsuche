import m from 'mithril';
import { div, a, button, pre, ul, li, table, th, tr, td, input, br, hr, h1, label, h2 } from './tags';

import solver from './solver';
import f from './f';
const { keys } = Object;


let startByRest = null;
let shuttle = [];
let logs = [];
let firstWord = '';
let secondWord = '';
let selected = {};
let selected2 = {};
let showing = [];
let swapped = false;

const log = str => logs.unshift(str);

const split = word =>
    f.use(word.search(/[aeiouy]/), pos => {
        let begin = word.substring(0, pos);
        let rest = word.substring(pos, word.length);
        return { begin, rest };
    });

const toRest = words => {
    let result = {};
    words.forEach(word => {
        const { begin, rest } = split(word);
        let arr = result[rest] || [];
        if (arr.indexOf(begin) < 0)
            arr.push(begin);
        result[rest] = arr;
    });
    keys(result).forEach(rest => {
        if (result[rest].length < 2)
            delete result[rest];
    })
    return result;
};

solver.whenReady(() => {
    startByRest = toRest(solver.words())
});

const swap = (a1) => swapped ? a1 : a1.slice().reverse();

m.mount(document.body, {
    view: vnode => {
        return div.container([
            h1('Schüttelreimsuche'),
            solver.ready() ? [
                label({ for: 'rhyme1' }, 'Erstes Reimwort eingeben'),
                input.$rhyme1({
                    oninput: e => {
                        const { begin, rest } = selected = split(e.target.value.toLowerCase());
                        showing = startByRest[rest] || [];
                        firstWord = begin + rest;
                        selected2 = {};
                        secondWord = '';
                    }
                }),
                button({ toggled: swapped, onclick: e => swapped = !swapped }, '< >'),
                div(firstWord),
                div(secondWord),
                showing.length > 0 && secondWord === '' ? 'Zweites Wort auswählen' : null,
                showing.map(begin => a.button({
                        disabled: begin === selected.begin,
                        onclick: e => {
                            if (secondWord === '') {
                                secondWord = begin + selected.rest;
                                selected2 = { begin }
                                showing = [];
                                showing = keys(startByRest).filter(key => {
                                    if (key === selected.rest)
                                        return false;
                                    return f.use(startByRest[key], begins => begins.indexOf(selected.begin) >= 0 && begins.indexOf(begin) >= 0);
                                });
                            }
                        }
                    },
                    selected2.begin !== undefined ? [
                        swap([selected.begin + selected.rest, ' ', selected2.begin + begin]),
                        br(),
                        swap([selected2.begin + selected.rest, ' ', selected.begin + begin])
                    ] :
                    begin + selected.rest)),
                hr(),
                h2('Wortschatzsuche'),
                label({ for: 'words' }, 'Suche eingeben'),
                input.$words({

                    oninput: e => {
                        shuttle = solver.words().filter(e_ => e_.indexOf(e.target.value) >= 0)
                    }
                }),
                div(shuttle.join(', ')),
            ] : 'Bitte warten, lade den Wortschatz...',
            hr(),
            a({ href: "https://github.com/abulvenz/schuttelreimsuche" }, 'Quelltext auf Github'),
            br(),
            a({ href: "https://eismaenners.de/2020/02/02/wertfrei/ " }, 'Ein Beispiel für ein Gedicht'),
        ]);
    }
});