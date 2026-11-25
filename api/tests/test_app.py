"""Tests de l'API Annuaire des enseignants."""
import json

import pytest

from app import DEFAULT_DATA_FILE, create_app

CHAMPS_OBLIGATOIRES = {"id", "nom", "departement", "email", "specialite", "bureau"}


@pytest.fixture
def client():
    """Client de test branché sur le vrai fichier data/enseignants.json."""
    return create_app(DEFAULT_DATA_FILE).test_client()


def client_avec_donnees(tmp_path, donnees):
    """Client de test branché sur un fichier JSON temporaire."""
    fichier = tmp_path / "enseignants.json"
    fichier.write_text(json.dumps(donnees, ensure_ascii=False), encoding="utf-8")
    return create_app(fichier).test_client()


def test_liste_complete(client):
    reponse = client.get("/api/enseignants")
    corps = reponse.get_json()
    assert reponse.status_code == 200
    assert corps["total"] == len(corps["enseignants"])
    assert corps["total"] >= 10
    for enseignant in corps["enseignants"]:
        assert CHAMPS_OBLIGATOIRES <= enseignant.keys()


def test_recherche_par_nom_sans_accent_ni_casse(client):
    for terme in ("karim", "KARIM", "Karim Benali"):
        corps = client.get("/api/enseignants", query_string={"nom": terme}).get_json()
        assert corps["total"] == 2
        assert all(e["nom"] == "Karim Benali" for e in corps["enseignants"])


def test_recherche_par_departement(client):
    corps = client.get("/api/enseignants?departement=physique").get_json()
    assert corps["total"] == 2
    assert all(e["departement"] == "Physique" for e in corps["enseignants"])
    # recherche tolérante aux accents : "mathematiques" trouve "Mathématiques"
    corps = client.get("/api/enseignants?departement=mathematiques").get_json()
    assert corps["total"] == 3


def test_recherche_sans_resultat(client):
    reponse = client.get("/api/enseignants?nom=zzzzzz")
    corps = reponse.get_json()
    assert reponse.status_code == 200
    assert corps["total"] == 0
    assert corps["enseignants"] == []


def test_detail_enseignant_existant(client):
    reponse = client.get("/api/enseignants/1")
    corps = reponse.get_json()
    assert reponse.status_code == 200
    assert corps["enseignant"]["id"] == 1
    assert corps["enseignant"]["nom"] == "Karim Benali"


def test_homonymes_distingues_par_id(client):
    premier = client.get("/api/enseignants/1").get_json()["enseignant"]
    second = client.get("/api/enseignants/11").get_json()["enseignant"]
    assert premier["nom"] == second["nom"]
    assert premier["id"] != second["id"]
    assert premier["departement"] != second["departement"]
    assert premier["email"] != second["email"]


def test_enseignant_inexistant(client):
    reponse = client.get("/api/enseignants/999")
    corps = reponse.get_json()
    assert reponse.status_code == 404
    assert "introuvable" in corps["message"]


def test_route_inconnue_renvoie_404_json(client):
    reponse = client.get("/api/inconnue")
    assert reponse.status_code == 404
    assert "message" in reponse.get_json()


def test_health(client):
    reponse = client.get("/api/health")
    corps = reponse.get_json()
    assert reponse.status_code == 200
    assert corps["message"] == "API fonctionnelle"


def test_nom_du_pod_vient_de_hostname(client, monkeypatch):
    monkeypatch.setenv("HOSTNAME", "api-test-pod")
    for url in ("/api/health", "/api/enseignants", "/api/enseignants/1"):
        assert client.get(url).get_json()["pod"] == "api-test-pod"


def test_fichier_json_absent_renvoie_500(tmp_path):
    client = create_app(tmp_path / "absent.json").test_client()
    reponse = client.get("/api/enseignants")
    assert reponse.status_code == 500
    assert reponse.get_json()["message"] == "Erreur interne du serveur"


def test_donnees_lues_depuis_le_fichier_fourni(tmp_path):
    client = client_avec_donnees(tmp_path, [
        {"id": 42, "nom": "Test Unique", "departement": "Test",
         "email": "t@example.com", "specialite": "Test", "bureau": "T-1"},
    ])
    corps = client.get("/api/enseignants").get_json()
    assert corps["total"] == 1
    assert corps["enseignants"][0]["id"] == 42


def test_photo_optionnelle(tmp_path):
    base = {"departement": "Test", "email": "t@example.com",
            "specialite": "Test", "bureau": "T-1"}
    client = client_avec_donnees(tmp_path, [
        {"id": 1, "nom": "Avec Photo", "photo": "/photos/avec-photo.jpg", **base},
        {"id": 2, "nom": "Sans Photo", **base},
    ])
    avec = client.get("/api/enseignants/1").get_json()["enseignant"]
    sans = client.get("/api/enseignants/2").get_json()["enseignant"]
    assert avec["photo"] == "/photos/avec-photo.jpg"
    assert "photo" not in sans