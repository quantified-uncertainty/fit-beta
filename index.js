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
		loss_ci_lower = (beta_cdf(ci_lower, a, b) - 0.05)**2 
		loss_ci_upper = (beta_cdf(ci_upper, a, b) - 0.95)**2
		loss = loss_ci_lower + loss_ci_upper
		return loss
	}
	
	const h = 2**(-14)
	const df_da = (a,b) => { // derivative of f with respect to a, at (a,b)
		f_h = f_to_minimize(a + h, b)
		f = f_to_minimize(a,b)
		result = (f_h - f)/h
		return result
	}
	const df_db = (a,b) => { // derivative of f with respect to b, at (a,b)
		f_h = f_to_minimize(a,b)
		f = f_to_minimize(a,b)
		result = (f_h - f)/h
		return result
	}

	// gradient descent step
	let epsilon = 2**(-14) // 1/16384
	let n_a = 2
	let n_b = 2
	let a = 1
	let b = 1
	for(let i = 0; i<2**14; i++){
		// gradient step for a
		let dir_a = - df_da(a,b)
		let stepsize_a = 1/n_a 
		let step_a = stepsize_a * dir_a 
		a = a + step_a
		n_a = n_a + 1

		// gradient step for b
		let dir_b = - df_db(a,b)
		let stepsize_b = 1/n_b
		let step_b = stepsize_b * dir_b
		b = b + step_b
		n_b = n_b + 1

	}
	return [a, b]
}
	ci_lower = 0.2
	ci_upper = 0.9

let result = find_beta_from_ci({ci_lower, ci_upper})
console.log(result)
