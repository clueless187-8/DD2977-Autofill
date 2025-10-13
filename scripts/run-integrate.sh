#!/usr/bin/env bash
# Wrapper to run the compiled integration script
set -euo pipefail

DATA=${1:-data/hazards.json}
echo "Running integration with hazards file: $DATA"
node dist/scripts/integrate.js "$DATA"
