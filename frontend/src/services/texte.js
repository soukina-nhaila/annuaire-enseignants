// Minuscules sans accents : "Mathématiques" et "mathematiques" sont équivalents.
export function normaliser(texte) {
    return String(texte ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// "Karim Benali" -> "KB"
export function initiales(nom) {
    const mots = String(nom ?? "").trim().split(/\s+/).filter(Boolean);
    if (mots.length === 0) return "?";
    const premiere = mots[0][0];
    const derniere = mots.length > 1 ? mots[mots.length - 1][0] : "";
    return (premiere + derniere).toUpperCase();
}