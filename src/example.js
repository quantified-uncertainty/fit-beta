import {find_beta_from_ci} from "./index.js"

console.log(1)
let result1 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8})
console.log(result1)

console.log(2)
let result2 = find_beta_from_ci({ci_lower: 0.3, ci_upper: 0.8, ci_length: 0.95})
console.log(result2)

console.log(3)
let result3 = find_beta_from_ci({ci_lower: "0.3", ci_upper: "0.8", ci_length: "0.95"})
console.log(result3)

console.log(4)
let result4 = find_beta_from_ci({ci_lower: 1/10**5, ci_upper: 1/10**3, ci_length: 0.9})
console.log(result3)
