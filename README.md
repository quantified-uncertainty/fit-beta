Fit beta
========

## About 

This package provides code for finding a beta distribution whose confidence interval is the one you desire. Native to node javascript, it can also be called from other programming languages by querying an endpoint.

## Usage

### Usage in Node

Install with:

```
yarn add fit-beta
# npm install fit-beta
```

Then set `"type": "module",` in your package json.

Then:

```js
import {find_beta_from_ci} from 'fit-beta'

let result1 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8})
console.log(result1)

```

### Advanced usage in Node

Besides `find_beta_from_ci`, this package also exports `find_beta_from_ci_nelder_mead` and `find_beta_from_ci_cache`, over `find_beta_from_ci` is just a thin wrapper:

```
export const find_beta_from_ci = ({ci_lower, ci_upper, ci_length}) => {
  let cache_answer = find_beta_from_ci_cache({ci_lower, ci_upper, ci_length})
  if(cache_answer != null ){
    return cache_answer
  } else {
    let nelder_mead_answer = find_beta_from_ci_nelder_mead({ci_lower, ci_upper, ci_length})
    return nelder_mead_answer
  }
}
```

`find_beta_from_ci_cache` is basically instantaneous, but only resolves when `ci_lower` and `ci_upper` are in (0.01, 0.02, 0.03, ..., 0.97, 0.98, 0.99, 1), and `ci_length` is 0.9 (i.e., 90%). `find_nelder_mead` uses the Nelder Mead algorithm, and will take a bit longer.

### Usage in R

Use the bootComb package instead:

```
# install.packages('bootComb')
library(bootComb)

params <- getBetaFromCI(qLow=0.2,qUpp=0.3,alpha=0.1)$pars
params
# ^ get the parameters of a beta distribution
# whose 90% (1-alpha) confidence interval
# is 0.2 to 0.8
```

### Usage in the browser

When using in the browser, you could:

- Translate this npm package to use web imports and syntax, etc. The problem with this is that it imports parts of stdlib, which is heavy and from which it is difficult to extract only a small part, because its code is very interconnected.
- Run this in a server, and query the server (this is what I am doing [here](https://nunosempere.com/blog/2023/03/15/fit-beta/)

### Usage in other programming languages

You can use this package indirectly in other programming languages by calling an endpoint.

#### Usage in Python

```python
import requests

def get_beta_from_ci(ci_lower, ci_upper, ci_length):
	url = 'https://trastos.nunosempere.com/fit-beta'
	data = {
		"ci_lower": ci_lower,
		"ci_upper": ci_upper,
		"ci_length": ci_length # actually optional
	}
	response = requests.post(url, json = data)
	json_response = response.json()
	return [json_response[0], json_response[1]]

answer = get_beta_from_ci(0.1, 0.8, 0.9)
print(answer)
```

See also [here](./src/other_langs/python/README.md) for caveats.

#### Usage with bash/curl

A simple version might be:

```sh

function fitbeta(){

	curl --silent -X POST -H "Content-Type: application/json" \
		-d '{"ci_lower": "'$1'", "ci_upper":"'$2'", "ci_length": "0.95"}' \
		https://trastos.nunosempere.com/fit-beta
}
```

The version which I'm actually using, which depends on [jq](https://stedolan.github.io/jq/) and [xclip](https://launchpad.net/xclip), looks as follows:

```sh
function fitbeta(){

	result=$(curl --silent -X POST -H "Content-Type: application/json" \
		-d '{"ci_lower": "'$1'", "ci_upper":"'$2'", "ci_length": "0.95"}' \
		https://trastos.nunosempere.com/fit-beta)
	echo "$result" | jq .
	echo "$result" | sed 's|\[|(|g' | sed 's|\]|)|g' | sed 's|,|, |g' | xclip -sel clip
	echo "(result also copied to keyboard)"

}
```


## Technical details

Code for this repository is inspired by [this package for R](https://github.com/gitMarcH/bootComb). In particular, that package uses R's powerful `optim` function, and I bothered looking up what `optim` uses as a default: the [Nelder Mead method](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method). I also used that package to populate the cache (see below).

For the Nelder Mead method, I am using [this implementation](https://github.com/benfred/fmin/blob/master/src/nelderMead.js) (I tried other algorithms, like [BFGS](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm), and [implemented](https://github.com/quantified-uncertainty/fit-beta/commit/ef65203941227227c11fe525e8d934250c45a4e6) a version of [backtracking line search](https://en.wikipedia.org/wiki/Backtracking_line_search), but Nelder Mead proved to just be better). See the `nelderMead` folder. 

For various functions, I am using [stdlib](https://stdlib.io/). I tried to extract the core code from them, but sadly all of its functions are fairly intertwined. 

## To do

- [ ] Add test coverage
- [x] Add a frontend to this. Now @ [nunosempere.com/blog/2023/03/15/fit-beta/](https://nunosempere.com/blog/2023/03/15/fit-beta/).
- [ ] ...

## Contributions

Contributions are welcome!

## License

Distributed under the MIT license, except for `src/nelderMead`, which is distributed under the BSD-3-Clause license, which is satisfied by including the BSD-3-Clause license in the `src/nelderMead` folder.
