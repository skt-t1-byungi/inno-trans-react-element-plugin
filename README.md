# 🚨[deprecated](Use [use-interpolate](https://github.com/skt-t1-byungi/use-interpolate)) inno-trans-react-element-plugin
inno-trans plugin for react element interpolation.

[![npm](https://flat.badgen.net/npm/v/inno-trans-react-element-plugin)](https://www.npmjs.com/package/inno-trans-react-element-plugin)

## Install
```sh
npm i inno-trans-react-element-plugin
```
```js
const InnoTrans = require('inno-trans')
const InnoTransReactElementPlugin = require('inno-trans-react-element-plugin')

InnoTrans.use(InnoTransReactElementPlugin) // install plugin.
```

## Example
```jsx
const t = InnoTrans({
    locale: 'en',
    messages: {
        en: {
            welcome: '<wrap>welcome<0/>to {name}</wrap>'
        }
    }
})

function App(){
    return t.rt('welcome', {wrap: <p className='a' />, 0: <br/>, name: 'my world'})
}

ReactDOM.render(<App />, document.getElementById('app'))
```
output:
```html
<div id="app">
    <p class='a'>welcome<br />to my world</p>
</div>
```

## API
### t.rt(key [, values [, options]])
Returns a message that matches the key. with react element interpolation.
```jsx
// 'hello' : '<0>hello<1 />{name}!!</0>'

t.rt('hello', {0: <div className='abc' />, 1: <br/>, name: 'byungi!'})

// => <div class='abc'>hello<br/>byungi!!</div>
```

### t.rtc(key, number [, values [, options]])
Returns a message that matches the key and the quantity number. with react element interpolation.

```jsx
// 'apple' : '<0>an apple</0>|<0>apples</0>'

t.rtc('apple', 10, {0: <div className='abc' />})

// => <div class='abc'>apples</div>
```

## Related
- [inno-trans](https://github.com/skt-t1-byungi/inno-trans) - simple localization library (inspired by laravel translation)
- [tag-name-parser](https://github.com/skt-t1-byungi/tag-name-parser) - A tag name parser that does not support attributes. Lightweight and fast when only need tag names.

## License
MIT
