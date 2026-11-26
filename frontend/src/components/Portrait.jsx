import { useState } from "react";
import { initiales } from "../services/texte.js";

// Photo si elle existe et se charge, sinon panneau bleu avec les initiales.
export default function Portrait({ nom, photo }) {
    const [erreur, setErreur] = useState(false);

    if (photo && !erreur) {
        return (
            <img
                className="portrait"
                src={photo}
                alt={`Portrait de ${nom}`}
                onError={() => setErreur(true)}
            />
        );
    }
    return (
        <div className="portrait portrait-initiales" role="img" aria-label={`Initiales de ${nom}`}>
            {initiales(nom)}
        </div>
    );
}