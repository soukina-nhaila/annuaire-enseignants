import { useEffect, useState } from "react";
import Message from "../components/Message.jsx";
import Portrait from "../components/Portrait.jsx";
import { getEnseignant } from "../services/api.js";

export default function ProfilPage({ id, onPod }) {
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

    return (
        <section className="section-liste">
            <div className="conteneur">
                <a className="lien-retour" href="#/enseignants">
                    ← Retour à l'annuaire
                </a>

                {chargement && <Message>Chargement de la fiche…</Message>}
                {erreur && <Message type="erreur">{erreur}</Message>}

                {enseignant && (
                    <article className="profil">
                        <Portrait nom={enseignant.nom} photo={enseignant.photo} />
                        <div>
                            <span className="carte-dept">{enseignant.departement}</span>
                            <h1>{enseignant.nom}</h1>
                            <p className="profil-spec">{enseignant.specialite}</p>
                            <dl>
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
                            <a className="btn btn-marine" href={`mailto:${enseignant.email}`}>
                                Contacter par email
                            </a>
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
}