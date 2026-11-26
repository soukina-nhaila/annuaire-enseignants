import { useState } from "react";
import Icone from "../components/Icone.jsx";
import PorteMedina from "../components/PorteMedina.jsx";
import TeacherCard from "../components/TeacherCard.jsx";
import Zellij from "../components/Zellij.jsx";
import { regrouperDepartements } from "../services/departements.js";

const FOND_HERO =
    "linear-gradient(90deg, #11264a 38%, rgba(17,38,74,0.78) 65%, rgba(17,38,74,0.55)), url(/images/hero.jpg)";

export default function AccueilPage({ enseignants }) {
    const [recherche, setRecherche] = useState("");
    const departements = regrouperDepartements(enseignants);
    const specialites = new Set(enseignants.map((e) => e.specialite));
    const aLaUne = enseignants.slice(0, 3);

    function lancerRecherche(evenement) {
        evenement.preventDefault();
        const q = recherche.trim();
        window.location.hash = q ? `#/enseignants?q=${encodeURIComponent(q)}` : "#/enseignants";
    }

    const statistiques = [
        { valeur: enseignants.length, libelle: "Enseignants référencés" },
        { valeur: departements.length, libelle: "Départements" },
        { valeur: specialites.size, libelle: "Domaines de spécialité" },
    ];

    return (
        <>
            <section className="hero" style={{ backgroundImage: FOND_HERO }}>
                <Zellij className="zellij-hero" />
                <div className="conteneur">
                    <span className="surtitre">Un espace pour découvrir et connecter</span>
                    <h1>L’excellence académique, à portée de recherche</h1>
                    <p>
                        Explorez les profils, les spécialités et les départements de notre communauté
                        enseignante dans un espace pensé pour vous.
                    </p>
                    <a className="btn btn-or" href="#/enseignants">
                        Explorer l’annuaire <Icone nom="fleche" />
                    </a>
                    <form className="recherche-hero" onSubmit={lancerRecherche} role="search">
                        <Icone nom="recherche" taille={20} />
                        <input
                            type="search"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Rechercher un nom ou une spécialité…"
                            aria-label="Rechercher un nom ou une spécialité"
                        />
                        <button className="btn btn-marine" type="submit">
                            Rechercher
                        </button>
                    </form>
                </div>
            </section>

            <div className="conteneur">
                <div className="stats">
                    <PorteMedina className="medina-stats" />
                    {statistiques.map((s) => (
                        <div className="stat" key={s.libelle}>
                            <div className="stat-valeur">{s.valeur}</div>
                            <div className="stat-libelle">{s.libelle}</div>
                            <div className="stat-note">Données de l'annuaire</div>
                        </div>
                    ))}
                </div>
            </div>

            <section className="section">
                <div className="conteneur">
                    <div className="section-tete">
                        <div>
                            <span className="surtitre surtitre-or">La communauté académique</span>
                            <h2>Enseignants à la une</h2>
                            <p className="section-texte">
                                Un aperçu des profils de l’annuaire. Retrouvez la liste complète dans la
                                rubrique Enseignants.
                            </p>
                        </div>
                        <a className="btn btn-petit btn-large" href="#/enseignants">
                            Voir tous les enseignants <Icone nom="fleche" taille={16} />
                        </a>
                    </div>
                    <div className="grille">
                        {aLaUne.map((e) => (
                            <TeacherCard key={e.id} enseignant={e} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bandeau-cta">
                <div className="conteneur cta-interne">
                    <div>
                        <span className="surtitre">Explorer par domaine</span>
                        <h2>Des savoirs, des perspectives.</h2>
                        <p>Découvrez les départements et trouvez le bon interlocuteur académique.</p>
                    </div>
                    <a className="btn btn-or" href="#/departements">
                        Voir les départements <Icone nom="fleche" />
                    </a>
                </div>
            </section>
        </>
    );
}