install.packages('bootComb')
library(bootComb)

getBetaFromCI(qLow=0.2,qUpp=0.8,alpha=0.1)
# ^ get the parameters of a beta distribution
# whose 90% (1-alpha) confidence interval
# is 0.2 to 0.8
dist1
