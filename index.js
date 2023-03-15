// import * as betainc from '/home/loki/Documents/core/sminimize_GradientDescentoftware/fresh/js/beta-ci/node_modules/@stdlib/math/base/special/betainc/lib/index.js'
import betainc from '@stdlib/math/base/special/betainc/lib/index.js'
import {minimize_L_BFGS} from "optimization-js/src/optimization.js"
import {minimize_GradientDescent} from "optimization-js/src/optimization.js"

/*
 * Betainc: Incomplete regularized 
 * betainc(x, a, b) = cdf(beta(a,b),x) in squiggle
 * i.e., how much probability the cdf has accumulated
 * by point x
 *
 * To keep this semantic meaning in mind, I am making a copy of the function in mind.
 */
const beta_cdf = ({x,a,b}) => betainc(x,a,b)
console.log(beta_cdf({x: 0.1, a: 1.0, b:25.0})) 
// should be ~0.928
// https://www.squiggle-language.com/playground#code=eNqrVirOyC8PLs3NTSyqVLIqKSpN1QELuaZkluQXwURSUtMSS3NKnPNTUpWslJJT0jSSUksSNQz1DHQUjEz1DBQ0dRQM9Aw1lWoBnIcZzA%3D%3D

const find_beta_from_ci = ({ci_lower, ci_upper}) => {

	function loss(x){
		let a = x[0]
		let b = x[1] 
		// let loss_ci_lower = (beta_cdf({x: ci_lower, a, b}) - 0.05)**2 
		// let loss_ci_upper = (beta_cdf({x: ci_upper, a, b}) - 0.95)**2
		let smoother = x => x**2 // Math.abs
		let loss_ci_lower = smoother(beta_cdf({x: ci_lower, a, b}) - 0.05)
		let loss_ci_upper = smoother(beta_cdf({x: ci_upper, a, b}) - 0.95)
		// the advantage of the Math.abs is that it has a clearer interpretation
		// (within x digits of the result)
		// and that it doesn't become very small very soon
		// the disadvantages is that it's slightly less differentiable
		let result = loss_ci_lower + loss_ci_upper
		// let result = Math.max(loss_ci_lower, loss_ci_upper)
		// console.log(`loss: ${result}`)
		return result
	}

	const h =0.0001
	function gradient2(x){
		let a = x[0]
		let b = x[1] 
		let f = loss([a,b])
		
		let f_h_a = loss([a + h, b])
		let f_h_b = loss([a, b+h])

		let df_da = (f_h_a - f)/h
		let df_db = (f_h_b - f)/h

		return [df_da, df_db]
	}

	let x0 = [ 4.0, 2.0]
	// let result = minimize_L_BFGS(objective, gradient, x0)
	let result = minimize_L_BFGS(loss, gradient2, x0)
	// let result2 = minimize_GradientDescent(loss, gradient, x0)
	console.log(loss(result.argument))
	return result
	
}

let ci_lower = 0.1
let ci_upper = 0.2

let result = find_beta_from_ci({ci_lower, ci_upper})
console.log(result)
/* console.log([a,b])
console.log(`beta(${a}, ${b})`)

console.log(beta_cdf({x: ci_lower, a, b}))
console.log(beta_cdf({x: ci_upper, a, b}))
*/
