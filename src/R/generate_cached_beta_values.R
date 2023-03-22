# install.packages('bootComb')
library(bootComb)

getBetaFrom90CI = function(qLow,qUpp){
	result = getBetaFromCI(qLow=qLow,qUpp=qUpp,alpha=0.1)$par
	return(result)

}

# Test function
# params = getBetaFrom90CI(0.2, 0.3)
# print(params)
# ^ get the parameters of a beta distribution
# whose 90% (1-alpha) confidence interval
# is 0.2 to 0.8

# Do a short run for n=10
n=100
xs = c(1:n)/n
ys = c(1:n)/n

xs_triangle = c()
ys_triangle = c()
lower_quantiles = c()
upper_quantiles = c()

for(x in xs){
	for(y in ys){
		if(x < y){
			result = getBetaFrom90CI(x,y)
			lower_quantile = result[1]
			upper_quantile = result[2]
			lower_quantiles = c(lower_quantiles, lower_quantile)
			upper_quantiles = c(upper_quantiles, upper_quantile)
			xs_triangle = c(xs_triangle, x)
			ys_triangle = c(ys_triangle, y)
		}
	}
}

# Print result as a json
toJsonArrayLine = function(attribute, zs, last=FALSE){
	cat("  ")
	cat('"')
	cat(attribute)
	cat('": [')
	almost_array = paste(zs, collapse=", ")
	# array = substring(almost_array,1, nchar(almost_array)-1)
	cat(almost_array)
	cat("]")
	if(!last){
		cat(",")
	}
	cat("\n")
}

cat("{\n")
toJsonArrayLine("xs",xs_triangle)
toJsonArrayLine("ys",ys_triangle)
toJsonArrayLine("lower_quantiles", lower_quantiles)
toJsonArrayLine("upper_quantiles", upper_quantiles, last=TRUE)
cat("}\n")
# cat(ys_triangle)
# cat(lower_quantiles)
# print(upper_quantiles)
