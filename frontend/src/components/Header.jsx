import Logo from "./Logo.jsx";

const LIENS = [
    { page: "accueil", href: "#/", libelle: "Accueil" },
    { page: "enseignants", href: "#/enseignants", libelle: "Enseignants" },
    { page: "departements", href: "#/departements", libelle: "Départements" },
    { page: "a-propos", href: "#/a-propos", libelle: "À propos" },
];

export default function Header({ pageActive }) {
    return (
        <header className="entete">
            <div className="conteneur entete-interne">
                <Logo />
                <nav className="nav" aria-label="Navigation principale">
                    {LIENS.map((lien) => (
                        <a
                            key={lien.page}
                            href={lien.href}
                            className={lien.page === pageActive ? "actif" : ""}
                            aria-current={lien.page === pageActive ? "page" : undefined}
                        >
                            {lien.libelle}
                        </a>
                    ))}
                </nav>
                <a className="btn btn-contour entete-bouton" href="#/enseignants">
                    Explorer l'annuaire ↗
                </a>
            </div>
        </header>
    );
}