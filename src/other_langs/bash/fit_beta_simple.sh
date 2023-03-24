#!/bin/bash
function fitbeta(){

	curl --silent -X POST -H "Content-Type: application/json" \
		-d '{"ci_lower": "'$1'", "ci_upper":"'$2'", "ci_length": "0.95"}' \
		https://trastos.nunosempere.com/fit-beta

}

