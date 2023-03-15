https://stdlib.io/docs/api/latest/@stdlib/math/base/special/betainc

Do the proper method
- Get direction from derivative
- Do the proper thing of scaling how much one moves to optimize it.
  - <https://en.wikipedia.org/wiki/Backtracking_line_search>
  - <https://en.wikipedia.org/wiki/Line_search>
- Maybe write somewhere why you can't do Newton. <https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant>
- <https://en.wikipedia.org/wiki/Beta_function#Incomplete_beta_function>

This already exists in R: 
- <https://github.com/gitMarcH/bootComb/blob/17a91be9757e6696f9e78c6e94f6aec473f045a6/R/internalFunctions.R>
- internally, it uses R's powerful "optim" function
  - Heh, exactly what I was thinking: <https://github.com/gitMarcH/bootComb/blob/17a91be9757e6696f9e78c6e94f6aec473f045a6/R/internalFunctions.R#L18>
- The alternative for js is <https://github.com/yanceyou/bfgs-algorithm/blob/master/lib/BFGSAlgorithm.js> (for example)
- It shouldn't take that long to write a js implementation.
- I could just do the proper backtracking line search myself, as well
