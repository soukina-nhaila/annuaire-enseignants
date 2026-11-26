import Icone from "../components/Icone.jsx";
import { descriptionDepartement, iconeDepartement, regrouperDepartements } from "../services/departements.js";

export default function DepartementsPage({ enseignants }) {
    const departements = regrouperDepartements(enseignants);

    return (
        <>
            <section className="bandeau bandeau-blanc">
                <div className="conteneur">
                    <span className="surtitre surtitre-or">Domaines de savoir</span>
                    <h1>Nos départements</h1>
                    <p>
                        Parcourez les différentes disciplines représentées dans cet annuaire.
                    </p>
                </div>
            </section>

            <section className="section-liste">
                <div className="conteneur grille-2">
                    {departements.map((d) => (
                        <article className="dept" key={d.nom}>
              <span className="dept-icone">
                <Icone nom={iconeDepartement(d.nom)} taille={20} />
              </span>
                            <h3>{d.nom}</h3>
                            <p>{descriptionDepartement(d.nom)}</p>
                            <div className="carte-pied">
                <span>
                  {d.total} enseignant{d.total > 1 ? "s" : ""}
                </span>
                                <a
                                    className="btn btn-petit"
                                    href={`#/enseignants?departement=${encodeURIComponent(d.nom)}`}
                                >
                                    Découvrir le département →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}