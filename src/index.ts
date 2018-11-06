import { ITranslator, TransOptions, ValueMap } from 'inno-trans/lib/types'
import { createElement, Fragment, isValidElement, ReactElement } from 'react'
import warning from 'warning'

type AnyReactElement = ReactElement<any>

declare module 'inno-trans/lib/types' {
    interface ITranslator {
        rt (key: string, values: ValueMap, opts: TransOptions): AnyReactElement
        rtc (key: string, num: number, values: ValueMap, opts: TransOptions): AnyReactElement
    }
}

const ZERO_WIDTH_CHAR = '\u0200c'
let REACT_ELEMENTS: AnyReactElement[] = []

export = (t: ITranslator) => {
    t.addFilter('*', collectReactElement)
    t.rt = reactTrans
    t.rtc = reactTranceChoice
}

function collectReactElement (value: any) {
    if (!isValidElement(value)) return value
    REACT_ELEMENTS.push(value)
    return ZERO_WIDTH_CHAR
}

function reactTrans (this: ITranslator, key: string, values: ValueMap, opts: TransOptions) {
    try {
        return attachReactElements(this.trans(key, values, opts))
    } finally {
        REACT_ELEMENTS = []
    }
}

function reactTranceChoice (this: ITranslator, key: string,num: number, values: ValueMap, opts: TransOptions) {
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
        `[inno-trans-react-element-plugin]
        This plugin uses "ZWNJ(\\u0200c)".
        If the message contains "ZWNJ", it will not work.`
    )

    const children: Array<string | AnyReactElement> = []

    for (const str of strings) {
        children.push(str)
        const reactElem = REACT_ELEMENTS.shift()
        if (reactElem) children.push(reactElem)
    }

    return createElement(Fragment, undefined, ...children)
}
