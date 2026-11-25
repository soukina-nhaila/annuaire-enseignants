// type : "info" | "erreur" | "vide"
export default function Message({ type = "info", children, action }) {
    return (
        <div className={`message message-${type}`} role={type === "erreur" ? "alert" : "status"}>
            <p>{children}</p>
            {action}
        </div>
    );
}