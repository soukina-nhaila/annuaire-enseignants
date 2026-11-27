#!/usr/bin/env bash
# Génère kubernetes/configmap.yaml à partir de data/enseignants.json.
# Usage : bash scripts/generer-configmap.sh
set -e
cd "$(dirname "$0")/.."

kubectl create configmap enseignants-data \
  --from-file=enseignants.json=data/enseignants.json \
  --namespace annuaire \
  --dry-run=client -o yaml > kubernetes/configmap.yaml

echo "kubernetes/configmap.yaml généré à partir de data/enseignants.json"