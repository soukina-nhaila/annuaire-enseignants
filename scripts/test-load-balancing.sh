#!/usr/bin/env bash
# Envoie N requêtes à /api/health et affiche quels Pods ont répondu.
# Usage : bash scripts/test-load-balancing.sh [URL_DE_BASE] [NOMBRE_DE_REQUETES]
# Exemple : bash scripts/test-load-balancing.sh http://annuaire.local 30

BASE_URL="${1:-http://annuaire.local}"
NB="${2:-30}"
TMP=$(mktemp)

for i in $(seq 1 "$NB"); do
  curl -s "$BASE_URL/api/health" | grep -o '"pod":"[^"]*"' | cut -d'"' -f4 >> "$TMP"
done

REPONSES=$(wc -l < "$TMP" | tr -d ' ')
DISTINCTS=$(sort -u "$TMP" | wc -l | tr -d ' ')

echo "Requetes envoyees : $NB  ->  $BASE_URL/api/health"
echo "--------------------------------------------"
echo "Repartition par Pod :"
sort "$TMP" | uniq -c | sort -rn | awk '{printf "  %-34s %3d requetes\n", $2, $1}'
echo "--------------------------------------------"
echo "Reponses recues            : $REPONSES / $NB"
echo "Pods distincts ayant repondu : $DISTINCTS"
rm -f "$TMP"

PRETS=$(kubectl get deployment api -n annuaire -o jsonpath='{.status.readyReplicas}' 2>/dev/null)
if [ -z "$PRETS" ]; then
  echo "Pods API prets (Kubernetes) : inconnu (kubectl indisponible)"
  exit 0
fi

echo "Pods API prets (Kubernetes)  : $PRETS"
if [ "$REPONSES" -eq "$NB" ] && [ "$DISTINCTS" -eq "$PRETS" ]; then
  echo "RESULTAT : OK, les $PRETS Pods prets ont tous repondu"
  exit 0
fi
echo "RESULTAT : ATTENTION, tous les Pods prets n'ont pas repondu"
exit 1