import { useState } from "react";
import { initiales } from "../services/texte.js";

// Affiche la photo si elle existe et se charge, sinon les initiales.
export default function Avatar({ nom, photo, grand = false }) {
    const [erreur, setErreur] = useState(false);
    const classe = grand ? "avatar avatar-grand" : "avatar";

    if (photo && !erreur) {
        return (
            <img
                className={classe}
                src={photo}
                alt={`Photo de ${nom}`}
                onError={() => setErreur(true)}
            />
        );
    }
    return (
        <div className={classe} aria-hidden="true">
            {initiales(nom)}
        </div>
    );
}