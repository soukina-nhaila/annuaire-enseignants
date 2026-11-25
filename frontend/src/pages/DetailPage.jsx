import { useEffect, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import Message from "../components/Message.jsx";
import { getEnseignant } from "../services/api.js";

export default function DetailPage({ id, onPod }) {
    const [enseignant, setEnseignant] = useState(null);
    const [erreur, setErreur] = useState(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        let annule = false;
        setChargement(true);
        setErreur(null);
        setEnseignant(null);

        getEnseignant(id)
            .then((donnees) => {
                if (annule) return;
                setEnseignant(donnees.enseignant);
                onPod(donnees.pod);
            })
            .catch((e) => {
                if (!annule) setErreur(e.message);
            })
            .finally(() => {
                if (!annule) setChargement(false);
            });

        return () => {
            annule = true;
        };
    }, [id, onPod]);

    const retour = (
        <a className="lien-retour" href="#/">
            ← Retour à la liste
        </a>
    );

    if (chargement) return <Message>Chargement de la fiche…</Message>;

    if (erreur) {
        return (
            <>
                {retour}
                <Message type="erreur">{erreur}</Message>
            </>
        );
    }

    return (
        <>
            {retour}
            <article className="fiche">
                <Avatar nom={enseignant.nom} photo={enseignant.photo} grand />
                <div>
                    <h2>{enseignant.nom}</h2>
                    <dl>
                        <dt>Identifiant</dt>
                        <dd>#{enseignant.id}</dd>
                        <dt>Département</dt>
                        <dd>{enseignant.departement}</dd>
                        <dt>Spécialité</dt>
                        <dd>{enseignant.specialite}</dd>
                        <dt>Bureau</dt>
                        <dd>{enseignant.bureau}</dd>
                        <dt>Email</dt>
                        <dd>
                            <a href={`mailto:${enseignant.email}`}>{enseignant.email}</a>
                        </dd>
                    </dl>
                </div>
            </article>
        </>
    );
}