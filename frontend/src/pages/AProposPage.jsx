export default function AProposPage() {
    const blocs = [
        {
            titre: "Une application en lecture seule",
            texte:
                "L'annuaire permet de consulter la liste des enseignants, de les rechercher par nom ou par département et d'afficher leur fiche détaillée.",
        },
        {
            titre: "Frontend et API indépendants",
            texte:
                "L'interface est développée avec React et Vite. Elle interroge une API REST Flask qui lit les données dans un fichier JSON.",
        },
        {
            titre: "Déployé avec Kubernetes",
            texte:
                "Les données sont fournies par une ConfigMap, l'application est exposée par un Ingress NGINX et supervisée par Nagios.",
        },
    ];

    return (
        <>
            <section className="bandeau bandeau-blanc">
                <div className="conteneur">
                    <span className="surtitre surtitre-or">Le projet</span>
                    <h1>À propos de l'annuaire</h1>
                    <p>
                        Mini-projet DEVOPS II, Groupe 12 — Faculté Polydisciplinaire de Larache,
                        Université Abdelmalek Essaâdi.
                    </p>
                </div>
            </section>
            <section className="section-liste">
                <div className="conteneur grille">
                    {blocs.map((b) => (
                        <article className="dept" key={b.titre}>
                            <h3>{b.titre}</h3>
                            <p>{b.texte}</p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}