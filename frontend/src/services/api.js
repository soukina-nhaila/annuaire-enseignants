// Base de l'API : vide = même domaine (proxy Vite en dev, Ingress en production).
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

async function requete(chemin) {
    let reponse;
    try {
        reponse = await fetch(`${API_BASE}${chemin}`, {
            headers: { Accept: "application/json" },
        });
    } catch {
        throw new ApiError(
            "Impossible de joindre l'API. Vérifiez que le serveur est démarré.",
            0
        );
    }

    let corps = null;
    try {
        corps = await reponse.json();
    } catch {
        // la réponse n'est pas du JSON
    }

    if (!reponse.ok) {
        throw new ApiError(
            corps?.message ?? `Erreur de l'API (HTTP ${reponse.status}).`,
            reponse.status
        );
    }
    if (corps === null) {
        throw new ApiError("Réponse invalide de l'API.", reponse.status);
    }
    return corps;
}

export const getEnseignants = () => requete("/api/enseignants");

export const getEnseignant = (id) =>
    requete(`/api/enseignants/${encodeURIComponent(id)}`);