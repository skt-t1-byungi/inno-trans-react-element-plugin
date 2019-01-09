import { ITranslator, TransOptions, ValueMap } from 'inno-trans/lib/types'
import { cloneElement, createElement, Fragment, isValidElement, ReactElement, ReactNode } from 'react'
import parseTag from 'tag-name-parser'

type TagNode = ReturnType<typeof parseTag>[number]

const DEFAULT_SYMBOL = '___INNO-TRANS-REACT-ELEMENT-PLUGIN___'

declare module 'inno-trans/lib/types' {
    interface ITranslator {
        rt (key: string, values: ValueMap, opts?: TransOptions): ReactElement<any> | TransOptions['defaults']
        rtc (key: string, num: number, values: ValueMap, opts?: TransOptions): ReactElement<any> | TransOptions['defaults']
    }
}

export = (trans: ITranslator): ITranslator => {
    trans.rt = reactTrans.bind(trans)
    trans.rtc = reactTranceChoice.bind(trans)
    return trans
}

function reactTrans (this: ITranslator, key: string, values: ValueMap, opts: TransOptions = {}) {
    const str = this.trans(key, values, { ...opts, defaults: DEFAULT_SYMBOL })
    if (str === DEFAULT_SYMBOL) return opts.defaults === undefined ? key : opts.defaults
    return strToReactElement(str, values)
}

function reactTranceChoice (this: ITranslator, key: string, num: number, values: ValueMap, opts: TransOptions = {}) {
    const str = this.transChoice(key, num, values, { ...opts, defaults: DEFAULT_SYMBOL })
    if (str === DEFAULT_SYMBOL) return opts.defaults === undefined ? key : opts.defaults
    return strToReactElement(str, values)
}

function strToReactElement (str: string, values: ValueMap) {
    return createElement(Fragment, undefined, ...nodesToReactNodes(parseTag(str), values))
}

function nodesToReactNodes (nodes: TagNode[], values: ValueMap): ReactNode[] {
    return nodes.map(node => nodeToReactNode(node, values))
}

function nodeToReactNode (node: TagNode, values: ValueMap): ReactNode {
    if (typeof node === 'string') return node
    const valueEl = isValidElement(values[node.name]) ? values[node.name] : createElement(Fragment)
    if (node.single) return valueEl
    return cloneElement(valueEl, undefined, ...nodesToReactNodes(node.children, values))
}
