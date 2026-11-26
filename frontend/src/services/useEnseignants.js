import { useCallback, useEffect, useState } from "react";
import { getEnseignants } from "./api.js";

// Charge une seule fois la liste complète, partagée par plusieurs pages.
export function useEnseignants(onPod) {
    const [etat, setEtat] = useState({ chargement: true, erreur: null, enseignants: [] });

    const charger = useCallback(async () => {
        setEtat((precedent) => ({ ...precedent, chargement: true, erreur: null }));
        try {
            const donnees = await getEnseignants();
            onPod?.(donnees.pod);
            setEtat({ chargement: false, erreur: null, enseignants: donnees.enseignants });
        } catch (e) {
            setEtat({ chargement: false, erreur: e.message, enseignants: [] });
        }
    }, [onPod]);

    useEffect(() => {
        charger();
    }, [charger]);

    return { ...etat, recharger: charger };
}