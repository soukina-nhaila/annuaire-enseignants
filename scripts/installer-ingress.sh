#!/usr/bin/env bash
# Installe F5 NGINX Ingress Controller (dépôt nginx/kubernetes-ingress)
# avec les manifestes officiels, dans le namespace nginx-ingress.
# Usage : bash scripts/installer-ingress.sh
set -e

VERSION="v5.8.1"
BASE="https://raw.githubusercontent.com/nginx/kubernetes-ingress/${VERSION}"

echo "Installation de NGINX Ingress Controller ${VERSION} ..."
kubectl apply -f "${BASE}/deploy/crds.yaml"
kubectl apply -f "${BASE}/deployments/common/ns-and-sa.yaml"
kubectl apply -f "${BASE}/deployments/rbac/rbac.yaml"
kubectl apply -f "${BASE}/deployments/common/nginx-config.yaml"
kubectl apply -f "${BASE}/deployments/common/ingress-class.yaml"
kubectl apply -f "${BASE}/deployments/deployment/nginx-ingress.yaml"
kubectl apply -f "${BASE}/deployments/service/loadbalancer.yaml"

echo "Attente du démarrage du contrôleur ..."
kubectl wait --for=condition=Available deployment --all -n nginx-ingress --timeout=240s

echo "--------------------------------------------"
kubectl get pods,svc -n nginx-ingress
kubectl get ingressclass