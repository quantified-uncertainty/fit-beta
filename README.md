Extract the parameters for a beta distribution from its 90% confidence interval
====================

## About 

This package provides code for obtaining the parameters of a beta distribution which will make it fit a given 90% confidence interval.

Although it is fast in terms of human usage (it takes half a second), it is not recommended for usage inside another project, like Squiggle, because 0.5s here and 0.5s there add up fairly fast. Rather, the code should be called, and the parameters included in the second program.

## Technical details

Code for this repository is inspired by [this package for R](https://github.com/gitMarcH/bootComb). In particular, that package uses R's powerful `optim` function, and I bothered looking up what `optim` uses as a default: the [Nelder Mead method](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method). From that R package, I am also using the default initial search point of a=50, b=50, though I add a grid search in case that fails. 

For the Nelder Mead method, I am using [this implementation](https://github.com/benfred/fmin/blob/master/src/nelderMead.js) of the [Nelder Mead method](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method) (I tried other algorithms, like [BFGS](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm), and implemented a version of [backtracking line search](https://en.wikipedia.org/wiki/Backtracking_line_search), but Nelder Mead proved to just be better). See the `nelderMead` folder. 

For various functions, I am using [stdlib](https://stdlib.io/). I tried to extract the core code from them, but sadly they are all fairly intertwined. 

## Installation

For now, I am not publishing this on npm 
