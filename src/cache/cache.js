import fs from "fs"
import path from "path"


import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let cache_path = path.join(__dirname, "cache.json")
let file = fs.readFileSync(cache_path)
export const cache = JSON.parse(file)


