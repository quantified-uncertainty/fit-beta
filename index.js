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

	const loss = (a,b) => {
		// let loss_ci_lower = (beta_cdf({x: ci_lower, a, b}) - 0.05)**2 
		// let loss_ci_upper = (beta_cdf({x: ci_upper, a, b}) - 0.95)**2
		let loss_ci_lower = Math.abs(beta_cdf({x: ci_lower, a, b}) - 0.05)
		let loss_ci_upper = Math.abs(beta_cdf({x: ci_upper, a, b}) - 0.95)
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
	const df_da = (a,b) => { // derivative of f with respect to a, at (a,b)
		let f_h = loss(a + h, b)
		let f = loss(a,b)
		let result = (f_h - f)/h
		return result
	}
	const df_db = (a,b) => { // derivative of f with respect to b, at (a,b)
		let f_h = loss(a, b)
		let f = loss(a, b+h)
		let result = (f_h - f)/h
		return result
	}
	
	// backtracking line search
	// <https://en.wikipedia.org/wiki/Backtracking_line_search>
	// Once we know the direction, how far to go along it?
	const get_optimal_step_size_a = ({a,b, d, is_a}) => {
		let dir = d_a > 0 ? 1 : -1 
		
		let step_size_min = 0
		let loss_s_min = is_a ? loss(a + step_size_min * dir, b) : loss(a, b + step_size_min * dir)
		
		let step_size_max = 0.1
		let loss_s_max = is_a ? loss(a + step_size_max * dir, b) : loss(a, b + step_size_max * dir)


		for(let i=0; i<20; i++){
			if(loss_s_min < loss_s_max){
				step_size_max = (step_size_max + step_size_min) / 2
				loss_s_max = is_a ? loss(a + step_size_max * dir, b) : loss(a, b + step_size_max * dir)
			}else{
				step_size_min = (step_size_max + step_size_min) / 2
				loss_s_min = is_a ? loss(a + step_size_min * dir, b) : loss(a, b + step_size_min * dir)
			}
		}
		return (step_size_min + step_size_max)/2
	}

	// gradient descent step
	const gradient_descent = (a_init,b_init) => {
		let a = a_init 
		let b = b_init
		let max_steps =  2000
		for(let i = 0; i<max_steps; i++){
			// gradient step for a
			let dir_a = - df_da(a,b)
			// console.log(dir_a)
			let stepsize_a = 0.0005 // 1/n_a 
			let step_a = stepsize_a // * dir_a 
			a = Math.max(a + step_a, 0)

			// gradient step for b
			let dir_b = - df_db(a,b)
			let stepsize_b = 0.0005 // 1/n_b
			let step_b = stepsize_b // * dir_b
			b = Math.max(b + step_b,0)
			// console.log(`a: ${a}, b: ${b}`)
		}
		return [a, b]
	}

	// Do the gradient step for 10 random starting points.
	let num_initializations = 30
	let best_loss = Infinity
	let best_result = null
	// for(let i=0; i<num_initializations; i++){
	while(best_loss > 0.001){
		let a_init = Math.random() * 5
		let b_init = Math.random() * 5
		let new_result = gradient_descent(a_init, b_init)
		let new_loss = loss(new_result[0], new_result[1])
		if( new_loss < best_loss){
			console.log(`new best loss: ${new_loss}`)
			// let [a,b] = new_result
			// console.log(beta_cdf({x: ci_lower, a, b}))
			// console.log(beta_cdf({x: ci_upper, a, b}))
			console.log(new_result)
			best_loss = new_loss
			best_result = new_result
		}
	}
	//}
	console.log(best_loss)
	return best_result
}

let ci_lower = 0.2
let ci_upper = 0.9

let [a, b] = find_beta_from_ci({ci_lower, ci_upper})
console.log([a,b])
console.log(`beta(${a}, ${b})`)

console.log(beta_cdf({x: ci_lower, a, b}))
console.log(beta_cdf({x: ci_upper, a, b}))
