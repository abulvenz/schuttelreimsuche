import m from 'mithril';
import { div, a, pre, ul, li, table, th, tr, td, input, br, hr } from './tags';

import solver from './solver';
import f from './f';
const { keys } = Object;

let mwords = null;
let word = '';
let candidates = [];
let byRest = null;
let shuttle = [];
let logs = [];
let firstWord = '';
let secondWord = '';
let selected = {};
let selected2 = {};

let showing = [];

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

m.mount(document.body, {
    view: vnode => {
        return div.container([
            solver.ready ? [
                a.button({
                    onclick: e => {
                        byRest = toRest(solver.words())
                    }
                }, '+'),
                byRest ?
                input({
                    oninput: e => {
                        const { begin, rest } = selected = split(e.target.value.toLowerCase());
                        showing = byRest[rest] || [];
                        firstWord = begin + rest;
                        selected2 = {};
                        secondWord = '';
                    }
                }) : null,
                div(firstWord),
                div(secondWord),
                showing.map(begin => a.button({
                    disabled: begin === selected.begin,
                    onclick: e => {
                        if (secondWord === '') {
                            secondWord = begin + selected.rest;
                            selected2 = { begin }
                            showing = [];
                            showing = keys(byRest).filter(key => {
                                if (key === selected.rest)
                                    return false;
                                return f.use(byRest[key], begins => begins.indexOf(selected.begin) > 0 && begins.indexOf(begin) > 0);
                            });
                        }
                    }
                }, selected2.begin !== undefined ? [selected2.begin + begin, br(), selected.begin + begin] : begin)),
                hr(),
                input({
                    oninput: e => {
                        shuttle = solver.words().filter(e_ => e_.indexOf(e.target.value) === 0)
                    }
                }),
                pre(shuttle.join(', ')),
            ] : 'Not ready, please wait...'
        ]);
    }
});