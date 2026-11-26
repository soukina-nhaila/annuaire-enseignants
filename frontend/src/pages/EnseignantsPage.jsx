import { useMemo, useState } from "react";
import Icone from "../components/Icone.jsx";
import Message from "../components/Message.jsx";
import TeacherCard from "../components/TeacherCard.jsx";
import { regrouperDepartements } from "../services/departements.js";
import { normaliser } from "../services/texte.js";

export default function EnseignantsPage({ enseignants, params }) {
    const [recherche, setRecherche] = useState(params.get("q") ?? "");
    const [departement, setDepartement] = useState(params.get("departement") ?? "");
    const [specialite, setSpecialite] = useState("");

    const departements = useMemo(() => regrouperDepartements(enseignants), [enseignants]);
    const specialites = useMemo(
        () => [...new Set(enseignants.map((e) => e.specialite))].sort((a, b) => a.localeCompare(b, "fr")),
        [enseignants]
    );

    const resultats = useMemo(() => {
        const terme = normaliser(recherche);
        return enseignants.filter(
            (e) =>
                normaliser(`${e.nom} ${e.specialite} ${e.departement}`).includes(terme) &&
                (departement === "" || e.departement === departement) &&
                (specialite === "" || e.specialite === specialite)
        );
    }, [enseignants, recherche, departement, specialite]);

    return (
        <>
            <section className="bandeau">
                <div className="conteneur">
                    <span className="surtitre surtitre-or">Explorer les profils</span>
                    <h1>Annuaire des enseignants</h1>
                    <p>
                        Recherchez un profil et parcourez les spécialités de la communauté enseignante.
                    </p>
                </div>
            </section>

            <section className="section-liste">
                <div className="conteneur">
                    <div className="filtres">
                        <label>
                            Nom ou mot-clé
                            <span className="champ">
                <Icone nom="recherche" taille={16} />
                <input
                    type="search"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Rechercher un nom, une spécialité…"
                />
              </span>
                        </label>
                        <label>
                            Département
                            <select value={departement} onChange={(e) => setDepartement(e.target.value)}>
                                <option value="">Tous les départements</option>
                                {departements.map((d) => (
                                    <option key={d.nom} value={d.nom}>
                                        {d.nom}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Spécialité
                            <select value={specialite} onChange={(e) => setSpecialite(e.target.value)}>
                                <option value="">Toutes les spécialités</option>
                                {specialites.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="puces" role="group" aria-label="Filtrer par département">
                        <button
                            type="button"
                            className={departement === "" ? "puce actif" : "puce"}
                            onClick={() => setDepartement("")}
                        >
                            Tous
                        </button>
                        {departements.map((d) => (
                            <button
                                type="button"
                                key={d.nom}
                                className={departement === d.nom ? "puce actif" : "puce"}
                                onClick={() => setDepartement(d.nom)}
                            >
                                {d.nom}
                            </button>
                        ))}
                    </div>

                    <div className="liste-entete" aria-live="polite">
                        <strong>Profils disponibles</strong>
                        <span>
              {resultats.length} enseignant{resultats.length > 1 ? "s" : ""}
            </span>
                    </div>

                    {resultats.length === 0 ? (
                        <Message type="vide">Aucun enseignant ne correspond à votre recherche.</Message>
                    ) : (
                        <div className="grille">
                            {resultats.map((e) => (
                                <TeacherCard key={e.id} enseignant={e} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}