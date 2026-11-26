import Logo from "./Logo.jsx";
import Zellij from "./Zellij.jsx";

export default function Footer({ pod }) {
    return (
        <footer className="pied">
            <Zellij className="zellij-pied" />
            <div className="conteneur">
                <div className="pied-grille">
                    <div>
                        <Logo clair />
                        <p className="pied-texte">
                            Une interface pour explorer les profils et les domaines d'expertise
                            de la communauté enseignante.
                        </p>
                    </div>
                    <div>
                        <h4>Navigation</h4>
                        <ul>
                            <li><a href="#/">Accueil</a></li>
                            <li><a href="#/enseignants">Enseignants</a></li>
                            <li><a href="#/departements">Départements</a></li>
                            <li><a href="#/a-propos">À propos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Contact &amp; liens</h4>
                        <ul>
                            <li>Faculté Polydisciplinaire de Larache</li>
                            <li>Université Abdelmalek Essaâdi</li>
                            <li>Larache, Maroc</li>
                        </ul>
                    </div>
                </div>
                <div className="pied-bas">
                    <span>© 2026 Groupe 12 · Projet d'annuaire des enseignants</span>
                    <span>{pod ? <>Réponse servie par le Pod : <strong>{pod}</strong></> : "En attente de l'API…"}</span>
                </div>
            </div>
        </footer>
    );
}