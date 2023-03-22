#!/bin/bash

Rscript generate_cached_beta_values.R > cache_R.json
node process_cache.js
