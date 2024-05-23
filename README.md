# cmtu - comment utils [![NPM version](https://img.shields.io/npm/v/cmtu.svg?style=flat)](https://www.npmjs.com/package/cmtu) [![NPM monthly downloads](https://img.shields.io/npm/dm/cmtu.svg?style=flat)](https://npmjs.org/package/cmtu) [![NPM total downloads](https://img.shields.io/npm/dt/cmtu.svg?style=flat)](https://npmjs.org/package/cmtu) 

> cmtu - removing comments from code string has never been this easy.

Cmtu is a Node.js package that helps you easily remove, extract, and [magic](#cmtu-object) comments from code strings.

Built with TypeScript and has full type support.

Supports the most popular programming languages like Python, JavaScript, etc. out of the box.

Please consider following this project's author, [Sina Bayandorian](https://github.com/sina-byn), and consider starring the project to show your :heart: and support.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
    - [cmtu](#cmtu)
    - [cmtu.stringSensitive](#cmtuStringSensitive)
- [Advanced Usage - Customization](#advanced-usage)
- [Interfaces](#interfaces)
    - [Resolver](#resolver)
    - [Built-In Languages](#built-in-languages)
    - [Options](#options)
    - [Cmtu Object](#cmtu-object)

## Install

Install with [npm](https://www.npmjs.com/package/cmtu):

```sh
$ npm install --save cmtu
```

## Usage

```js
const cmtu = require('cmtu');

// * create and configure a cmtu object
const jsCmtu = cmtu(cmtu.Languages.JS.resolver);
const jsCode = `
/*
this is a multi-line JS comment
*/

const callout = 'this is not a comment';

// this is a single line js comment
`;

const codeWithNoComments = jsCmtu.strip(jsCode);

console.log(codeWithNoComments, codeWithNoComments.length);
```
see [built-in languages](#built-in-languages) for a list of all built-in languages

## API

### [cmtu](index.ts#L18)

returns a [`cmtu-object`](#cmtu-object) configured based on the args passed to it.

**Params**
* `resolver` : [`Resolver`](#resolver)

* `options` : optional - [`Options`](#options)
    - `stringSensitive` : `boolean | undefined`

      - if set to `true` will ignore strings that include a comment based on the provided string literals

    - `stringLiterals` : `string[] | undefined`

      defines the list of string literals - characters that a string start and end with
      - defaults to JavaScript string literals if `stringSensitive` is set to `true`
      - only used when `stringSensitive` is set to `true`

    - `exclude` : `RegExp[] | undefined`
      - an array of regexes
      - the comments that are matched by either one of these regexes are excluded from the output

**Returns**
* [`cmtu-object`](#cmtu-object)

**Example**

```js
// initialize a pre-configured cmtu-object - jsCmtu
const jsCmtu = cmtu(cmtu.Languages.JS.resolver);
const jsCode = `
/*
this is a multi-line JS comment
*/

const callout = '// this is not a comment';

// this is a single line js comment
`;

const { strip, extract, magic } = jsCmtu;
// in this case the callout value will be included
// even though it's not an actual comment and is 
// a string because this instance the cmtu object
// exposes methods that are not string sensitive

// each of these methods is explained below
// at the cmtu-object section

const comments = jsCmtu.extract(jsCode);

console.log(comments);
```

### <a id="cmtuStringsensitive" href="index.ts#L60">cmtu.stringSensitive</a>

returns a [`cmtu-object`](#cmtu-object) configured based on the args passed to it - the difference however is that methods exposed by this [`cmtu-object`](#cmtu-object) are <u>stringSensitive</u> meaning that in the rare cases where your strings might include comments themselves, these methods can understand the difference. Take a look at the example below:

**Params**
* `resolver` : [`Resolver`](#resolver)

* `options` : optional - [`Omit<Options, 'stringSensitive'>`](#options)
    - `stringLiterals` : `string[] | undefined`
    
      defines the list of string literals - characters that a string start and end with
      - defaults to JavaScript string literals if `stringSensitive` is set to `true`
      - only used when `stringSensitive` is set to `true`

    - `exclude` : `RegExp[] | undefined`
      - an array of regexes
      - the comments that are matched by either one of these regexes are excluded from the output

**Returns**
* [`cmtu-object`](#cmtu-object)

**Example**

```js
// initialize a pre-configured cmtu-object - jsCmtu
const jsCmtu = cmtu.stringSensitive(cmtu.Languages.JS.resolver);
const jsCode = `
/*
this is a multi-line JS comment
*/

const callout = '// this is not a comment';

// this is a single line js comment
`;

const { strip, extract, magic } = jsCmtu;
// in this case the callout value won't be included
// as it's not an actual comment and is a comment
// inside of a srting

// each of these methods is explained below
// at the cmtu-object section

const codeWithNoComments = jsCmtu.strip(jsCode);

console.log(codeWithNoComments, codeWithNoComments.length);
```

## Advanced Usage

you can customize cmtu to use it for languages that are not part of [`cmtu.Languages`](#built-in-languages) by default, for example:

```js
// note that python is included in cmtu.Languages, and
// this is just an example to help you understand how
// to customize cmtu for your own use cases

const pyCode = `
# this is a comment in python
callout = "// this is not a comment in python"
#! python comment to be excluded
`;

// in order to customize the returned cmtu object
// we need to pass a proper resolver for python

// regex string to match python comments
const pyResolver = '#.*';
const pyStringLiterals = ["'", '"', "'''", '"""'];

const pyCmtu = cmtu.stringSensitive(
  pyResolver,
  {
    stringLiterals: pyStringLiterals,
    exclude: [/#!.*/] // optional
  }
);

const { strip, extract, magic } = pyCmtu;

console.log(extract(pyCode));
console.log(strip(pyCode));
console.log(magic(pyCode));
```


## Interfaces

### [Resolver](languages.ts#L8)

```typescript
type Resolver =
  | string
  | { block: string }
  | { inline: string }
  | { block: string; inline: string };
```

### [Built-In Languages](languages.ts#L6)

```typescript
type LanguageName = 'JS' | 'CSS' | 'HTML' | 'CPP' | 'GO' | 'PYTHON' | 'PHP';

// support for php multi-line strings is lacking
// a good idea is to use a regex to exclude the
// comments that are within multi-line strings
```

### [Options](index.ts#L12)

```typescript
type Options = {
  stringSensitive?: boolean;
  stringLiterals?: string[];
  exclude?: RegExp[];
};
```

### [Cmtu Object](index.ts#L53)
```ts
// 1- methods exposed by any configured cmtu object
// 2- return type of cmtu(...) and cmtu.stringSensitive(...)

{
  // returns a string with with its comments stripped
  strip: (code: string) => string;

  // returns an array of the stripped comments
  extract: (code: string) => string[];

  // returns a tuple [comment-stripped string, stripped comments]
  magic: (code: string) => [string, string[]];
}
```
