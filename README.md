Fit beta
========

## About 

This package provides code for finding a beta distribution whose confidence interval is the one you desire

~~Although it is fast in terms of human usage (it takes a fifth of a second), it is not recommended for usage inside another project, like Squiggle, because 0.5s here and 0.5s there add up fairly fast. Rather, the code should be called, and the parameters included in the second program.~~ Edit: now it is faster, though convergence is not guaranteed. Mixed feelings about including it in Squiggle.

## Technical details

Code for this repository is inspired by [this package for R](https://github.com/gitMarcH/bootComb). In particular, that package uses R's powerful `optim` function, and I bothered looking up what `optim` uses as a default: the [Nelder Mead method](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method). From that R package, I am also using the default initial search point of a=50, b=50, though I add a grid search in case that fails. 

For the Nelder Mead method, I am using [this implementation](https://github.com/benfred/fmin/blob/master/src/nelderMead.js) (I tried other algorithms, like [BFGS](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm), and [implemented](https://github.com/quantified-uncertainty/fit-beta/commit/ef65203941227227c11fe525e8d934250c45a4e6) a version of [backtracking line search](https://en.wikipedia.org/wiki/Backtracking_line_search), but Nelder Mead proved to just be better). See the `nelderMead` folder. 

For various functions, I am using [stdlib](https://stdlib.io/). I tried to extract the core code from them, but sadly all of its functions are fairly intertwined. 

## Installation

```
yarn add fit-beta
# npm install fit-beta
```

## Usage

### Usage in Nodejs.

Set `"type": "module",` in your package json, then:

```js
import {find_beta_from_ci} from 'fit-beta'

let result1 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8})
console.log(result1)

```

### Usage in the browser

I haven't figured this one out. In particular, including packages is annoying. The relevant parts of stdlib can be included, but they are just pretty heavy. Happy to get a pull request to bundle this for the web, though.

### Usage in other languages

- R: See [here](./src/R/beta.R)
- Python: to do?
- If you are a friend: I'm happy to share an endpoint, i.e., a website url that you can call with the desired confidence intervals and get back the beta parameters. 

## To do

- [ ] Add test coverage
- [x] Add a frontend to this
- [ ] ...

## Contributions

Contributions are welcome.

## License

Distributed under the MIT license, except for `src/nelderMead`, which is distributed under the BSD-3-Clause license, which is satisfied by including the BSD-3-Clause license in the `src/nelderMead` folder.
