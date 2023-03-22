import fs from "fs"

let file = fs.readFileSync("./cache_R.json")
let json_object = JSON.parse(file)

let xs = json_object.xs
let ys = json_object.ys
let lower_quantiles = json_object.lower_quantiles
let upper_quantiles = json_object.upper_quantiles

let result_obj = ({})
let n = xs.length

for(let i = 0; i<n; i++){
	let x = xs[i]
	let y = ys[i]
	let l = lower_quantiles[i]
	let u = upper_quantiles[i]
	result_obj[x] = !!result_obj[x] ?  result_obj[x] : ({})
	console.log(result_obj[x])
	result_obj[x][y] = [l,u]
}

console.log(result_obj)
fs.writeFileSync("./cache.json", JSON.stringify(result_obj, null, 2))
