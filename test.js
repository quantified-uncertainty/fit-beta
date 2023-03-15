import {find_beta_from_ci} from "./index.js"
let ci_lower = 0.3
let ci_upper = 0.8

let result = find_beta_from_ci({ci_lower, ci_upper})
console.log(result)
/* console.log([a,b])
console.log(`beta(${a}, ${b})`)

console.log(beta_cdf({x: ci_lower, a, b}))
console.log(beta_cdf({x: ci_upper, a, b}))
*/
