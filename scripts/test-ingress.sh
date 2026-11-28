#!/usr/bin/env bash
# Teste le routage de l'Ingress : un seul domaine, deux chemins (/ et /api).
# Usage : bash scripts/test-ingress.sh [URL_DE_BASE]   (défaut : http://annuaire.local)

BASE_URL="${1:-http://annuaire.local}"
echec=0

verifier() {
  description="$1"
  chemin="$2"
  attendu="$3"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$chemin")
  if [ "$code" = "$attendu" ]; then
    echo "OK     $description  ($chemin) -> HTTP $code"
  else
    echo "ECHEC  $description  ($chemin) -> HTTP $code (attendu $attendu)"
    echec=1
  fi
}

echo "Test de l'Ingress : $BASE_URL"
echo "--------------------------------------------"
verifier "Frontend"                 "/"                         200
verifier "API (racine)"             "/api"                      200
verifier "API health"               "/api/health"               200
verifier "Liste des enseignants"    "/api/enseignants"          200
verifier "Detail enseignant 1"      "/api/enseignants/1"        200
verifier "Enseignant inexistant"    "/api/enseignants/999"      404
echo "--------------------------------------------"
echo "Reponse de /api/health :"
curl -s "$BASE_URL/api/health"
echo
if [ "$echec" -eq 0 ]; then
  echo "RESULTAT : tous les tests sont OK"
else
  echo "RESULTAT : au moins un test a echoue"
fi
exit "$echec"