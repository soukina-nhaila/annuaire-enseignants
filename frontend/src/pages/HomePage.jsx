import { useCallback, useEffect, useMemo, useState } from "react";
import Message from "../components/Message.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TeacherCard from "../components/TeacherCard.jsx";
import { getEnseignants } from "../services/api.js";
import { normaliser } from "../services/texte.js";

export default function HomePage({ onPod }) {
    const [enseignants, setEnseignants] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);
    const [nom, setNom] = useState("");
    const [departement, setDepartement] = useState("");

    const charger = useCallback(async () => {
        setChargement(true);
        setErreur(null);
        try {
            const donnees = await getEnseignants();
            setEnseignants(donnees.enseignants);
            onPod(donnees.pod);
        } catch (e) {
            setErreur(e.message);
        } finally {
            setChargement(false);
        }
    }, [onPod]);

    useEffect(() => {
        charger();
    }, [charger]);

    const departements = useMemo(
        () => [...new Set(enseignants.map((e) => e.departement))].sort((a, b) => a.localeCompare(b, "fr")),
        [enseignants]
    );

    const resultats = useMemo(
        () =>
            enseignants.filter(
                (e) =>
                    normaliser(e.nom).includes(normaliser(nom)) &&
                    (departement === "" || e.departement === departement)
            ),
        [enseignants, nom, departement]
    );

    if (chargement) return <Message>Chargement des enseignants…</Message>;

    if (erreur) {
        return (
            <Message
                type="erreur"
                action={
                    <button className="bouton" onClick={charger}>
                        Réessayer
                    </button>
                }
            >
                {erreur}
            </Message>
        );
    }

    return (
        <>
            <SearchBar
                nom={nom}
                onNom={setNom}
                departement={departement}
                onDepartement={setDepartement}
                departements={departements}
                total={resultats.length}
            />
            {resultats.length === 0 ? (
                <Message type="vide">Aucun enseignant ne correspond à votre recherche.</Message>
            ) : (
                <div className="grille">
                    {resultats.map((e) => (
                        <TeacherCard key={e.id} enseignant={e} />
                    ))}
                </div>
            )}
            <button className="bouton bouton-secondaire" onClick={charger}>
                Actualiser
            </button>
        </>
    );
}