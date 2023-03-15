# install.packages('bootComb')
library(bootComb)

params <- getBetaFromCI(qLow=0.2,qUpp=0.3,alpha=0.1)$pars
params
# ^ get the parameters of a beta distribution
# whose 90% (1-alpha) confidence interval
# is 0.2 to 0.8
