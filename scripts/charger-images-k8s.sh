#!/usr/bin/env bash
# Charge les images Docker locales dans le noeud du cluster Kubernetes
# (cluster "kind" de Docker Desktop).
# Usage : bash scripts/charger-images-k8s.sh [nom_du_noeud]

NOEUD="${1:-desktop-control-plane}"
IMAGES="annuaire-api:1.0.0 annuaire-frontend:1.0.0"

charger() {
  image="$1"
  # 1re tentative : uniquement la plateforme linux/amd64
  if docker save --platform linux/amd64 "$image" 2>/dev/null \
      | docker exec -i "$NOEUD" ctr -n k8s.io images import - >/dev/null 2>&1; then
    return 0
  fi
  # 2e tentative : sans option de plateforme
  docker save "$image" | docker exec -i "$NOEUD" ctr -n k8s.io images import - >/dev/null
}

for image in $IMAGES; do
  echo "Chargement de $image dans le noeud $NOEUD ..."
  if charger "$image"; then
    echo "OK     $image"
  else
    echo "ECHEC  $image"
    exit 1
  fi
done

echo "--------------------------------------------"
echo "Images annuaire présentes dans le noeud :"
docker exec "$NOEUD" crictl images | grep annuaire