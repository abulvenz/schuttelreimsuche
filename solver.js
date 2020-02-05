import m from 'mithril';
import Typo from 'typo-js';

const { sqrt, trunc, min, max } = Math;

import aff from './de-DE/de-DE.aff';
import dic from './de-DE/de-DE.dic';
import f from './f';


let dictionary = null;
let words = null;

let complete = true;

if (complete) {
    setTimeout(() =>
        fetch(aff)
        .then(json => (json.text().then(
            aff_text => {
                fetch(dic).then(json => (json.text().then(
                    dic_text => {
                        dictionary = new Typo("de_DE", aff_text, dic_text)
                        words = (Object
                            .keys(dictionary.dictionaryTable)
                            //      .filter(e => e.length <= 8 && e.length >= 6)
                            .filter(e => e !== e.toUpperCase())
                            .map(e => e.toLowerCase())
                            .filter(e => f.hasVowel(e) &&
                                e.indexOf('-') < 0 &&
                                e.indexOf('�') < 0 &&
                                /*                                e.indexOf('ä') < 0 &&
                                                                e.indexOf('ß') < 0 &&
                                                                e.indexOf('ö') < 0 &&
                                                                e.indexOf('ü') < 0 &&*/
                                e.indexOf('.') < 0)
                        )
                        m.redraw();
                    }
                )))
            }))),
        200
    );
} else {
    dictionary = 'e'

    words = ([
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
    ])
}

export default {
    words: () => words,
    ready: () => !!dictionary,
}