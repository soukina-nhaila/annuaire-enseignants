import { useEffect, useState } from "react";
import DetailPage from "./pages/DetailPage.jsx";
import HomePage from "./pages/HomePage.jsx";

// Routage minimal par hash : "#/" = liste, "#/enseignants/3" = fiche
function lireRoute() {
    const correspondance = window.location.hash.match(/^#\/enseignants\/(\d+)$/);
    return correspondance ? { page: "detail", id: correspondance[1] } : { page: "liste" };
}

export default function App() {
    const [route, setRoute] = useState(lireRoute);
    const [pod, setPod] = useState(null);

    useEffect(() => {
        const maj = () => setRoute(lireRoute());
        window.addEventListener("hashchange", maj);
        return () => window.removeEventListener("hashchange", maj);
    }, []);

    return (
        <div className="application">
            <header className="entete">
                <a href="#/">
                    <h1>Annuaire des enseignants</h1>
                </a>
                <p>Faculté Polydisciplinaire de Larache</p>
            </header>

            <main className="contenu">
                {route.page === "detail" ? (
                    <DetailPage id={route.id} onPod={setPod} />
                ) : (
                    <HomePage onPod={setPod} />
                )}
            </main>

            <footer className="pied">
                {pod ? <>Dernière réponse de l'API servie par le Pod : <strong>{pod}</strong></> : "En attente de l'API…"}
                <br />
                Mini-projet DEVOPS II — Groupe 12
            </footer>
        </div>
    );
}