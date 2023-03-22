import {find_beta_from_ci} from "./index.js"

console.log({ci_lower: 0.3, ci_upper: 0.8})
let result1 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8})
console.log(result1)

/*
let result2 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8, ci_length: 0.95})
console.log(result2)

let result3 = find_beta_from_ci({ci_lower: 0.001, ci_upper: 0.01, ci_length: 0.90})
console.log(result3)
*/
