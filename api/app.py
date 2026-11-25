"""API REST « Annuaire des enseignants » (lecture seule).

Les données sont lues dans un fichier JSON. Chemin du fichier :
- variable d'environnement ENSEIGNANTS_FILE (ex. fichier monté par une ConfigMap),
- sinon data/enseignants.json à la racine du projet.
"""
import json
import os
import socket
import unicodedata
from pathlib import Path

from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException

DEFAULT_DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "enseignants.json"


def get_pod_name():
    """Nom du Pod Kubernetes (HOSTNAME), sinon nom de la machine."""
    return os.environ.get("HOSTNAME") or socket.gethostname()


def normaliser(texte):
    """Minuscules sans accents, pour une recherche tolérante."""
    texte = unicodedata.normalize("NFD", str(texte))
    texte = "".join(c for c in texte if unicodedata.category(c) != "Mn")
    return texte.casefold().strip()


def create_app(data_file=None):
    app = Flask(__name__)
    app.json.ensure_ascii = False
    app.json.sort_keys = False
    app.config["DATA_FILE"] = str(
        data_file or os.environ.get("ENSEIGNANTS_FILE") or DEFAULT_DATA_FILE
    )

    def charger_enseignants():
        with open(app.config["DATA_FILE"], "r", encoding="utf-8") as fichier:
            donnees = json.load(fichier)
        if not isinstance(donnees, list):
            raise ValueError("Le fichier JSON doit contenir une liste d'enseignants")
        return donnees

    def reponse(message, status=200, **extra):
        corps = {"message": message, "pod": get_pod_name(), **extra}
        return jsonify(corps), status

    @app.get("/api")
    @app.get("/api/")
    def accueil():
        return reponse("API Annuaire des enseignants")

    @app.get("/api/health")
    def health():
        return reponse("API fonctionnelle", status_api="ok")

    @app.get("/api/enseignants")
    def lister_enseignants():
        enseignants = charger_enseignants()
        nom = request.args.get("nom", "").strip()
        departement = request.args.get("departement", "").strip()
        if nom:
            enseignants = [e for e in enseignants if normaliser(nom) in normaliser(e["nom"])]
        if departement:
            enseignants = [
                e for e in enseignants
                if normaliser(departement) in normaliser(e["departement"])
            ]
        return reponse(
            "Liste des enseignants", total=len(enseignants), enseignants=enseignants
        )

    @app.get("/api/enseignants/<int:enseignant_id>")
    def detail_enseignant(enseignant_id):
        for enseignant in charger_enseignants():
            if enseignant["id"] == enseignant_id:
                return reponse("Détails de l'enseignant", enseignant=enseignant)
        return reponse(f"Enseignant {enseignant_id} introuvable", status=404)

    @app.errorhandler(Exception)
    def gerer_erreur(erreur):
        if isinstance(erreur, HTTPException):
            return reponse(erreur.description, status=erreur.code)
        app.logger.exception("Erreur interne")
        return reponse("Erreur interne du serveur", status=500)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")))