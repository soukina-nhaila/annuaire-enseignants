// Silhouette stylisée d'une porte de médina (remparts, arc en fer à cheval, arbre).
export default function PorteMedina({ className = "" }) {
    return (
        <svg
            className={`medina ${className}`}
            viewBox="0 0 360 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M0 96 H360" />
            {/* rempart gauche */}
            <path d="M6 96 V62 H18 V56 H30 V62 H42 V56 H54 V62 H66 V56 H78 V62 H90 V56 H102 V62 H118 V96" />
            {/* tour de la porte */}
            <path d="M118 96 V28 H132 V22 H146 V28 H160 V22 H174 V28 H188 V22 H202 V28 H216 V96" />
            {/* arc en fer à cheval et son encadrement */}
            <path d="M147 96 V66 A21 21 0 1 1 187 66 V96" />
            <path d="M140 96 V66 A28 28 0 1 1 194 66 V96" />
            {/* rempart droit */}
            <path d="M216 62 H228 V56 H240 V62 H252 V56 H264 V62 H276 V56 H288 V96" />
            {/* arbre */}
            <path d="M322 96 V70" />
            <circle cx="322" cy="54" r="16" />
            <circle cx="308" cy="64" r="9" />
            <circle cx="336" cy="64" r="9" />
        </svg>
    );
}