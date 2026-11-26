import Portrait from "./Portrait.jsx";

export default function TeacherCard({ enseignant }) {
    return (
        <a className="carte" href={`#/enseignants/${enseignant.id}`}>
            <Portrait nom={enseignant.nom} photo={enseignant.photo} />
            <div className="carte-corps">
                <span className="carte-dept">{enseignant.departement}</span>
                <h3>{enseignant.nom}</h3>
                <p className="carte-spec">{enseignant.specialite}</p>
                <div className="carte-pied">
                    <span>Bureau {enseignant.bureau}</span>
                    <span className="btn btn-petit">Voir le profil →</span>
                </div>
            </div>
        </a>
    );
}