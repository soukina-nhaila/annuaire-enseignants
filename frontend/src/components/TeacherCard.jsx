import Avatar from "./Avatar.jsx";

export default function TeacherCard({ enseignant }) {
    return (
        <a className="carte" href={`#/enseignants/${enseignant.id}`}>
            <Avatar nom={enseignant.nom} photo={enseignant.photo} />
            <div className="carte-texte">
                <h2>{enseignant.nom}</h2>
                <p className="departement">{enseignant.departement}</p>
                <p className="specialite">{enseignant.specialite}</p>
                <p className="bureau">Bureau {enseignant.bureau}</p>
            </div>
        </a>
    );
}