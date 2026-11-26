import { useId } from "react";

// Motif de zellij : étoile à huit branches (deux carrés superposés)
// répétée en mosaïque. La couleur vient de la propriété CSS "color".
export default function Zellij({ className = "" }) {
    const id = useId().replace(/:/g, "");
    return (
        <svg
            className={`zellij ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke="currentColor" strokeWidth="0.9">
                        <rect x="10" y="10" width="36" height="36" />
                        <rect x="10" y="10" width="36" height="36" transform="rotate(45 28 28)" />
                        <circle cx="28" cy="28" r="6" />
                        <path d="M0 0 L8 8 M56 0 L48 8 M0 56 L8 48 M56 56 L48 48" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}