import { ITranslator, TransOptions, ValueMap } from 'inno-trans/lib/types'
import { createElement, Fragment, isValidElement, ReactElement } from 'react'
import warning from 'warning'

type AnyReactElement = ReactElement<any>

interface ITranslatorWithReact extends ITranslator {
    rt (key: string, values?: ValueMap, opts?: TransOptions): AnyReactElement
    rtc (key: string, num: number, values?: ValueMap, opts?: TransOptions): AnyReactElement
}

const ZERO_WIDTH_CHAR = '\u0200c'
let REACT_ELEMENTS: AnyReactElement[] = []

export = (t: ITranslator) => {
    const tr = t as ITranslatorWithReact
    tr.addFilter('*', collectReactElement)
    tr.rt = reactTrans
    tr.rtc = reactTranceChoice
    return tr
}

function collectReactElement (value: any) {
    if (!isValidElement(value)) return value
    REACT_ELEMENTS.push(value)
    return ZERO_WIDTH_CHAR
}

function reactTrans (this: ITranslator, key: string, values?: ValueMap, opts?: TransOptions) {
    try {
        return attachReactElements(this.trans(key, values, opts))
    } finally {
        REACT_ELEMENTS = []
    }
}

function reactTranceChoice (this: ITranslator, key: string,num: number, values?: ValueMap, opts?: TransOptions) {
    try {
        return attachReactElements(this.transChoice(key, num, values, opts))
    } finally {
        REACT_ELEMENTS = []
    }
}

function attachReactElements (message: string) {
    const strings = message.split(ZERO_WIDTH_CHAR)

    warning(
        strings.length > REACT_ELEMENTS.length + 1,
        '[inno-trans-react-element-plugin]\n' +
        'This plugin uses "ZWNJ(\\u0200c)".\n' +
        'If the message contains "ZWNJ", it will not work.\n'
    )

    const children: Array<string | AnyReactElement> = []

    for (const str of strings) {
        children.push(str)
        const reactEl = REACT_ELEMENTS.shift()
        if (reactEl) children.push(reactEl)
    }

    return createElement(Fragment, undefined, ...children)
}
