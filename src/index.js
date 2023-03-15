import {nelderMead} from './nelderMead/nelderMead.js';
import betainc from '@stdlib/math-base-special-betainc/lib/index.js'

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

export const find_beta_from_ci = ({ci_lower, ci_upper, ci_length}) => {
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
	
	// point at which to give up
	let target_loss = 10e-8
	// Try a sensible default
	console.log("Try an initial approximation")
	let x0_init = [ 50, 50 ] 
	let nelderMead_init = nelderMead(loss, x0_init);
	let result_init = [nelderMead_init.x[0], nelderMead_init.x[1]]
	let loss_init = loss(result_init)
	console.log(`Initial loss: ${loss_init}`)

	if(loss_init < target_loss){
		return result_init
	}
	
	// if the sensible default doesn't work,
	// try a grid search
	console.log("Initial approximation did not converge, trying a grid search")
	let min_loss = Infinity
	let result = null
	for(let a=1; a<40; a=a+2){
		for(let b=1; b<40; b=b+2){
			let x0 = [ a, b ]
			
			let nelderMead_output = nelderMead(loss, x0);
			let new_result = [nelderMead_output.x[0], nelderMead_output.x[1]]
			let new_loss = loss(new_result)

			if(new_loss < target_loss){
				console.log(new_loss)
				return new_result
			}

			if(new_loss < min_loss){
				min_loss = new_loss
				result = new_result 
			}
		}
	}
	console.log(`Initial grid loss: ${loss_init}`)
	if(min_loss < target_loss){
		return result
	}

	// try a more hardcore grid search
	console.log("Initial grid search did not converge, trying a more hardcore grid search")
	for(let a=1; a<1000; a=a+0.1){
		for(let b=1; b<1000; b=b+0.1){
			let x0 = [ a, b ]
			
			let nelderMead_output = nelderMead(loss, x0);
			let new_result = [nelderMead_output.x[0], nelderMead_output.x[1]]
			let new_loss = loss(new_result)

			if(new_loss < target_loss){
				console.log(new_loss)
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

