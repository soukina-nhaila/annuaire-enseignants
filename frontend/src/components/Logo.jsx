import { useState } from "react";

function Embleme({ src, alt, onAbsent }) {
    return <img className="logo-image" src={src} alt={alt} onError={onAbsent} />;
}

// Affiche les logos de l'université et de la faculté s'ils existent
// (public/logos/uae.png et public/logos/fpl.png), sinon le carré doré ✦.
export default function Logo({ clair = false }) {
    const [uaeAbsent, setUaeAbsent] = useState(false);
    const [fplAbsent, setFplAbsent] = useState(false);
    const aucunLogo = uaeAbsent && fplAbsent;

    return (
        <a className={clair ? "logo logo-clair" : "logo"} href="#/">
            {!uaeAbsent && (
                <Embleme
                    src="/logos/uae.png"
                    alt="Université Abdelmalek Essaâdi"
                    onAbsent={() => setUaeAbsent(true)}
                />
            )}
            {!uaeAbsent && !fplAbsent && <span className="logo-separateur" aria-hidden="true" />}
            {!fplAbsent && (
                <Embleme
                    src="/logos/fpl.png"
                    alt="Faculté Polydisciplinaire de Larache"
                    onAbsent={() => setFplAbsent(true)}
                />
            )}
            {aucunLogo && (
                <span className="logo-carre" aria-hidden="true">
          ✦
        </span>
            )}
            <span className="logo-texte">
        <span className="logo-nom">Faculté Polydisciplinaire de Larache</span>
        <span className="logo-sous">Groupe 12 · Annuaire académique</span>
      </span>
        </a>
    );
}