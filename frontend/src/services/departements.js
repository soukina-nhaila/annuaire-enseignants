import { normaliser } from "./texte.js";

const DESCRIPTIONS = {
    informatique:
        "Explorer les technologies, les systèmes numériques et les nouvelles façons de concevoir le web.",
    mathematiques: "Faire dialoguer raisonnement, modélisation et applications concrètes.",
    "economie et gestion":
        "Comprendre les organisations, les marchés et les enjeux de demain.",
    "sciences humaines":
        "Étudier les langues, les cultures et les dynamiques qui façonnent notre société.",
    physique:
        "Explorer la matière, l'énergie et les lois qui gouvernent les phénomènes naturels.",
    chimie: "Analyser, transformer et comprendre la matière à l'échelle moléculaire.",
    "langues et communication":
        "Maîtriser les langues et l'art de communiquer dans un contexte académique et professionnel.",
};

export function descriptionDepartement(nom) {
    return DESCRIPTIONS[normaliser(nom)] ?? "Découvrez les enseignants de ce département.";
}

export function iconeDepartement(nom) {
    const n = normaliser(nom);
    if (n.includes("informatique")) return "code";
    if (n.includes("mathematiques")) return "sigma";
    if (n.includes("economie")) return "courbe";
    if (n.includes("physique")) return "atome";
    if (n.includes("chimie")) return "fiole";
    if (n.includes("langues") || n.includes("communication")) return "bulle";
    if (n.includes("humaines")) return "livre";
    return "etoile";
}

// [{ nom: "Informatique", total: 3 }, ...] trié par nom
export function regrouperDepartements(enseignants) {
    const compteur = new Map();
    for (const e of enseignants) {
        compteur.set(e.departement, (compteur.get(e.departement) ?? 0) + 1);
    }
    return [...compteur.entries()]
        .map(([nom, total]) => ({ nom, total }))
        .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}