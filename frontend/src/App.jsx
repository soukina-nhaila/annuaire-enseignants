import { useEffect, useState } from "react";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Message from "./components/Message.jsx";
import AccueilPage from "./pages/AccueilPage.jsx";
import AProposPage from "./pages/AProposPage.jsx";
import DepartementsPage from "./pages/DepartementsPage.jsx";
import EnseignantsPage from "./pages/EnseignantsPage.jsx";
import ProfilPage from "./pages/ProfilPage.jsx";
import { useEnseignants } from "./services/useEnseignants.js";

// Routage par hash : #/  #/enseignants  #/enseignants?departement=X
// #/enseignants/3  #/departements  #/a-propos
function lireRoute() {
    const brut = window.location.hash.replace(/^#/, "") || "/";
    const [chemin, requete = ""] = brut.split("?");
    const params = new URLSearchParams(requete);
    const profil = chemin.match(/^\/enseignants\/(\d+)$/);
    if (profil) return { page: "profil", id: profil[1], params, cle: brut };
    if (chemin === "/enseignants") return { page: "enseignants", params, cle: brut };
    if (chemin === "/departements") return { page: "departements", params, cle: brut };
    if (chemin === "/a-propos") return { page: "a-propos", params, cle: brut };
    return { page: "accueil", params, cle: brut };
}

export default function App() {
    const [route, setRoute] = useState(lireRoute);
    const [pod, setPod] = useState(null);
    const annuaire = useEnseignants(setPod);

    useEffect(() => {
        const maj = () => {
            setRoute(lireRoute());
            window.scrollTo(0, 0);
        };
        window.addEventListener("hashchange", maj);
        return () => window.removeEventListener("hashchange", maj);
    }, []);

    const pageNav = route.page === "profil" ? "enseignants" : route.page;

    // Les pages qui ont besoin de la liste attendent son chargement.
    function avecListe(rendu) {
        if (annuaire.chargement) {
            return (
                <div className="conteneur section-etat">
                    <Message>Chargement des enseignants…</Message>
                </div>
            );
        }
        if (annuaire.erreur) {
            return (
                <div className="conteneur section-etat">
                    <Message
                        type="erreur"
                        action={
                            <button className="btn btn-marine" onClick={annuaire.recharger}>
                                Réessayer
                            </button>
                        }
                    >
                        {annuaire.erreur}
                    </Message>
                </div>
            );
        }
        return rendu();
    }

    let contenu;
    switch (route.page) {
        case "profil":
            contenu = <ProfilPage key={route.cle} id={route.id} onPod={setPod} />;
            break;
        case "enseignants":
            contenu = avecListe(() => (
                <EnseignantsPage key={route.cle} enseignants={annuaire.enseignants} params={route.params} />
            ));
            break;
        case "departements":
            contenu = avecListe(() => <DepartementsPage enseignants={annuaire.enseignants} />);
            break;
        case "a-propos":
            contenu = <AProposPage />;
            break;
        default:
            contenu = avecListe(() => <AccueilPage enseignants={annuaire.enseignants} />);
    }

    return (
        <div className="application">
            <Header pageActive={pageNav} />
            <main>{contenu}</main>
            <Footer pod={pod} />
        </div>
    );
}