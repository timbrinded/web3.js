# web3-utils

This is a sub package of [web3.js][repo]

This contains useful utility functions for Dapp developers.   
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install web3-utils
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-Utils.js` in your html file.
This will expose the `Web3Utils` object on the window object.


## Usage

```js
import * as Utils from 'web3-utils';

console.log(Utils);
> {
    sha3: Function,
    soliditySha3: Function,
    isAddress: Function,
    ...
}
```

## Types 

If you are using TypeScript all the types are defined in the `index.d.ts` file


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js

