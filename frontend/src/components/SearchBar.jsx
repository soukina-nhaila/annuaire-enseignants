export default function SearchBar({
                                      nom,
                                      onNom,
                                      departement,
                                      onDepartement,
                                      departements,
                                      total,
                                  }) {
    return (
        <div className="recherche">
            <label>
                <span>Rechercher par nom</span>
                <input
                    type="search"
                    value={nom}
                    placeholder="Ex. : Karim"
                    onChange={(e) => onNom(e.target.value)}
                />
            </label>
            <label>
                <span>Filtrer par département</span>
                <select value={departement} onChange={(e) => onDepartement(e.target.value)}>
                    <option value="">Tous les départements</option>
                    {departements.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </label>
            <p className="compteur" aria-live="polite">
                {total} enseignant{total > 1 ? "s" : ""}
            </p>
        </div>
    );
}