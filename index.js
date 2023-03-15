// import * as betainc from '/home/loki/Documents/core/software/fresh/js/beta-ci/node_modules/@stdlib/math/base/special/betainc/lib/index.js'
import betainc from '@stdlib/math/base/special/betainc/lib/index.js'

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

	const f_to_minimize = (a,b) => {
		let loss_ci_lower = (beta_cdf({x: ci_lower, a, b}) - 0.05)**2 
		let loss_ci_upper = (beta_cdf({x: ci_upper, a, b}) - 0.95)**2
		console.l
		let loss = loss_ci_lower + loss_ci_upper
		// console.log(`loss: ${loss}`)
		return loss
	}
	
	const h = 2**(-14)
	const df_da = (a,b) => { // derivative of f with respect to a, at (a,b)
		let f_h = f_to_minimize(a + h, b)
		let f = f_to_minimize(a,b)
		let result = (f_h - f)/h
		return result
	}
	const df_db = (a,b) => { // derivative of f with respect to b, at (a,b)
		let f_h = f_to_minimize(a, b)
		let f = f_to_minimize(a, b+h)
		let result = (f_h - f)/h
		return result
	}

	// gradient descent step
	let epsilon = 2**(-14) // 1/16384
	let n_a = 2
	let n_b = 2
	let a = 2.5
	let b = 3
	let max_steps = 1000 * 1000
	for(let i = 0; i<max_steps; i++){
		// gradient step for a
		let dir_a = - df_da(a,b)
		let stepsize_a = 0.001 // 1/n_a 
		let step_a = stepsize_a * dir_a 
		a = Math.max(a + step_a, 0)
		n_a = n_a + 1

		// gradient step for b
		let dir_b = - df_db(a,b)
		let stepsize_b = 0.001 // 1/n_b
		let step_b = stepsize_b * dir_b
		b = Math.max(b + step_b,0)
		n_b = n_b + 1
		// console.log(`a: ${a}, b: ${b}`)
	}
	return [a, b]
}

let ci_lower = 0.2
let ci_upper = 0.9

let result = find_beta_from_ci({ci_lower, ci_upper})
console.log(result)
console.log(`beta(${result[0]}, ${result[1]})`)
