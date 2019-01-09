import test, { Macro } from 'ava'
import InnoTrans from 'inno-trans'
import React from 'react'
import InnoTransReactElementPlugin from '../src/index'

InnoTrans.use(InnoTransReactElementPlugin)
const trans = InnoTrans({ locale: 'ko' })
const rt = (key: string, values: any) => {
    trans.addMessages('ko', { [key]: key })
    return trans.rt(key, values)
}
const rtc = (key: string, num: number, values: any) => {
    trans.addMessages('ko', { [key]: key })
    return trans.rtc(key, num, values)
}
const macro: Macro<[any, any]> = (t, actual, expeceted) => t.deepEqual(actual, expeceted)

test('string', macro,
    rt('test', {}),
    <>test</>
)

test('wrap', macro,
    rt('hello<0>world</0>', { 0: <span /> }),
    <>hello<span>world</span></>
)

test('props (className)', macro,
    rt(`hello<0>world</0>!!`, { 0: <span className='a' /> }),
    <>hello<span className='a'>world</span>!!</>
)

test('single', macro,
    rt('hello<0/>world', { 0: <br /> }),
    <>hello<br/>world</>
)

test('nested', macro,
    rt('ab<0>de<1>ef</1>gh</0>', { 0: <div />, 1: <p /> }),
    <>ab<div>de<p>ef</p>gh</div></>
)

test('if no value #1', macro,
    rt('hello<0/>world', {}),
    <>hello<></>world</>
)

test('if no value #2', macro,
    rt('hello<0>world</0>', {}),
    <>hello<>world</></>
)

test('rtc', macro,
    rtc('single|<0>many</0>', 2, { 0: <div /> }),
    <><div>many</div></>
)

test('behaviors when there is no key', t => {
    t.is(trans.rt('no message', { 0: <br/> }), 'no message')
    t.is(trans.rt('no message', { 0: <br/> }, { defaults: 'test' }), 'test')
})
