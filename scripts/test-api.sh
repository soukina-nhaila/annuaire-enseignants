#!/usr/bin/env bash
# Teste l'API en HTTP réel.
# Usage : bash scripts/test-api.sh [URL_DE_BASE]
# Exemple : bash scripts/test-api.sh http://localhost:5000

BASE_URL="${1:-http://localhost:5000}"
echec=0

verifier() {
  description="$1"
  url="$2"
  attendu="$3"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "$attendu" ]; then
    echo "OK     $description -> HTTP $code"
  else
    echo "ECHEC  $description -> HTTP $code (attendu $attendu)"
    echec=1
  fi
}

echo "Test de l'API : $BASE_URL"
echo "--------------------------------------------"
verifier "Health check"            "$BASE_URL/api/health"                          200
verifier "Liste des enseignants"   "$BASE_URL/api/enseignants"                     200
verifier "Detail enseignant 1"     "$BASE_URL/api/enseignants/1"                   200
verifier "Recherche par nom"       "$BASE_URL/api/enseignants?nom=karim"           200
verifier "Recherche departement"   "$BASE_URL/api/enseignants?departement=physique" 200
verifier "Enseignant inexistant"   "$BASE_URL/api/enseignants/999"                 404
echo "--------------------------------------------"
echo "Reponse du health check :"
curl -s "$BASE_URL/api/health"
echo
if [ "$echec" -eq 0 ]; then
  echo "RESULTAT : tous les tests sont OK"
else
  echo "RESULTAT : au moins un test a echoue"
fi
exit "$echec"