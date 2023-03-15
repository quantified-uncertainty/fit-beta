import {nelderMead} from './nelderMead.js';
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

