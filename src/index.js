import {nelderMead} from './nelderMead/nelderMead.js';
import betainc from '@stdlib/math-base-special-betainc/lib/index.js'
import {cache} from "./cache/cache.js"
/*
 * Betainc: Incomplete regularized beta function
 * <https://en.wikipedia.org/wiki/Beta_function#Incomplete_beta_function>
 * betainc(x, a, b) = cdf(beta(a,b),x) in squiggle
 * i.e., how much probability the cdf has accumulated
 * by point x
 *
 * To keep this semantic meaning in mind, I am making a copy of the function in mind.
 */

const beta_cdf = ({x,a,b}) => betainc(x,a,b)
/*
// console.log(beta_cdf({x: 0.1, a: 1.0, b:25.0})) 
// should be ~0.928
// https://www.squiggle-language.com/playground#code=eNqrVirOyC8PLs3NTSyqVLIqKSpN1QELuaZkluQXwURSUtMSS3NKnPNTUpWslJJT0jSSUksSNQz1DHQUjEz1DBQ0dRQM9Aw1lWoBnIcZzA%3D%3D
*/ 
const VERBOSE = false;
export const find_beta_from_ci_nelder_mead = ({ci_lower, ci_upper, ci_length}) => {
  ci_length = (ci_length > 0 && ci_length < 1) ? (ci_length || 0.9) : 0.9
	ci_length = ci_length > 0.5 ? ci_length : 1 - ci_length 
	let lower_interval = (1 - ci_length)/2 // e.g, 0.05 for a ci_length of 0.9, or a 90% ci
	let upper_interval = 1 - lower_interval // e.g., 0.95
	function loss(x){
		let a = x[0]
		let b = x[1] 
		let smoother = x => x**2 // Math.abs
		let loss_ci_lower = smoother(beta_cdf({x: ci_lower, a, b}) - lower_interval)
		let loss_ci_upper = smoother(beta_cdf({x: ci_upper, a, b}) - upper_interval)
		// the advantage of the Math.abs is that it has a clearer interpretation
		// (within x digits of the result)
		// and that it doesn't become very small very soon
		// the disadvantages is that it's slightly less differentiable
		let result = loss_ci_lower + loss_ci_upper
		// console.log(`loss: ${result}`)
		return result
	}

	const h =0.0001
	function gradient(x){ // not used, but useful for other optimization methods.
		let a = x[0]
		let b = x[1] 
		let f = loss([a,b])
		
		let f_h_a = loss([a + h, b])
		let f_h_b = loss([a, b+h])

		let df_da = (f_h_a - f)/h
		let df_db = (f_h_b - f)/h

		return [df_da, df_db]
	}
	
	// Try a sensible default
	let x0_init = [ 1, 1 ] 
	let nelderMead_init = nelderMead(loss, x0_init);
	let result_init = [nelderMead_init.x[0], nelderMead_init.x[1]]
	let loss_init = loss(result_init)
	// console.log(loss_init)

	if(loss_init < 10e-8){
		if(VERBOSE) console.log("Found in first guess")
		return result_init
	}

	// Try another sensible default
	let x0_init_2 = [ 50, 50 ] 
	let nelderMead_init_2 = nelderMead(loss, x0_init_2);
	let result_init_2 = [nelderMead_init_2.x[0], nelderMead_init_2.x[1]]
	let loss_init_2 = loss(result_init_2)
	// console.log(loss_init)

	if(loss_init_2 < 10e-8){
		if(VERBOSE) console.log("Found in second guess")
		return result_init_2
	}
	
	// if the sensible default doesn't work,
	// try a grid search
	let min_loss = Infinity
	let result = null
	for(let a=1; a<40; a=a+2){
		for(let b=1; b<40; b=b+2){
			let x0 = [ a, b ]
			
			let nelderMead_output = nelderMead(loss, x0);
			let new_result = [nelderMead_output.x[0], nelderMead_output.x[1]]
			let new_loss = loss(new_result)

			if(new_loss < 10e-8){
				if(VERBOSE) console.log(`Found @ a: ${a}, b: ${b}`)
				return new_result
			}

			if(new_loss < min_loss){
				min_loss = new_loss
				result = new_result 
			}
		}
	}
	// console.log(min_loss)
	return result 
	
}

export const find_beta_from_ci_cache = ({ci_lower, ci_upper, ci_length}) => {
  ci_length = (ci_length > 0 && ci_length < 1) ? (ci_length || 0.9) : 0.9
	if(ci_length == 0.9 && Object.hasOwn(cache, ci_lower) && Object.hasOwn(cache[ci_lower], ci_upper)){
		return cache[ci_lower][ci_upper]
	} else {
		return null
	}
}

export const find_beta_from_ci = ({ci_lower, ci_upper, ci_length}) => {
  ci_length = (ci_length > 0 && ci_length < 1) ? (ci_length || 0.9) : 0.9
  let cache_answer = find_beta_from_ci_cache({ci_lower, ci_upper, ci_length})
	if(cache_answer != null ){
		// console.log("Answer in the cache")
		return cache_answer
	} else {
		// console.log("Answer from Nelder Mead")
		let nelder_mead_answer = find_beta_from_ci_nelder_mead({ci_lower, ci_upper, ci_length})
		return nelder_mead_answer
	}
}
