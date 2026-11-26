import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App.jsx";

const ENSEIGNANTS = [
    { id: 1, nom: "Karim Benali", departement: "Informatique", email: "karim.benali@example.com", specialite: "Cloud Computing et DevOps", bureau: "B-101" },
    { id: 2, nom: "Salma El Idrissi", departement: "Informatique", email: "salma.elidrissi@example.com", specialite: "Intelligence artificielle", bureau: "B-102" },
    { id: 3, nom: "Leila Chraibi", departement: "Physique", email: "leila.chraibi@example.com", specialite: "Physique des matériaux", bureau: "C-301" },
    { id: 4, nom: "Karim Benali", departement: "Mathématiques", email: "k.benali.maths@example.com", specialite: "Algèbre et géométrie", bureau: "A-203" },
];

function json(corps, status = 200) {
    return { ok: status >= 200 && status < 300, status, json: async () => corps };
}

// Remplace fetch par une fausse API qui renvoie les données ci-dessus.
function installerFausseApi() {
    const fetchMock = vi.fn(async (url) => {
        const chemin = String(url);
        if (chemin.endsWith("/api/enseignants")) {
            return json({ message: "Liste des enseignants", pod: "api-test", total: ENSEIGNANTS.length, enseignants: ENSEIGNANTS });
        }
        const correspondance = chemin.match(/\/api\/enseignants\/(\d+)$/);
        if (correspondance) {
            const trouve = ENSEIGNANTS.find((e) => e.id === Number(correspondance[1]));
            return trouve
                ? json({ message: "Détails de l'enseignant", pod: "api-test", enseignant: trouve })
                : json({ message: `Enseignant ${correspondance[1]} introuvable`, pod: "api-test" }, 404);
        }
        return json({ message: "Introuvable" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

function cartes() {
    return screen.getAllByRole("heading", { level: 3 });
}

beforeEach(() => {
    window.location.hash = "";
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("Annuaire des enseignants", () => {
    test("la page d'accueil affiche les statistiques et le nom du Pod", async () => {
        installerFausseApi();
        render(<App />);

        const carteEnseignants = (await screen.findByText("Enseignants référencés")).closest(".stat");
        expect(within(carteEnseignants).getByText("4")).toBeInTheDocument();
        const carteDepartements = screen.getByText("Départements", { selector: ".stat-libelle" }).closest(".stat");
        expect(within(carteDepartements).getByText("3")).toBeInTheDocument();
        expect(screen.getByText("api-test")).toBeInTheDocument();
    });

    test("la liste affiche tous les enseignants avec leur département", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);

        await screen.findAllByRole("heading", { level: 3 });
        expect(cartes()).toHaveLength(4);
        expect(screen.getAllByText("Physique").length).toBeGreaterThan(0);
    });

    test("la recherche par nom filtre la liste", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.type(screen.getByRole("searchbox"), "salma");
        expect(cartes()).toHaveLength(1);
        expect(cartes()[0]).toHaveTextContent("Salma El Idrissi");
    });

    test("la recherche ignore les accents et les majuscules", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.type(screen.getByRole("searchbox"), "ALGEBRE");
        expect(cartes()).toHaveLength(1);
        expect(cartes()[0]).toHaveTextContent("Karim Benali");
    });

    test("le filtre par département fonctionne", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.selectOptions(screen.getByRole("combobox", { name: /^Département/ }), "Informatique");
        expect(cartes()).toHaveLength(2);

        await userEvent.selectOptions(screen.getByRole("combobox", { name: /^Département/ }), "Physique");
        expect(cartes()).toHaveLength(1);
        expect(cartes()[0]).toHaveTextContent("Leila Chraibi");
    });

    test("un message s'affiche quand aucun enseignant ne correspond", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.type(screen.getByRole("searchbox"), "zzzzzz");
        expect(screen.getByText(/Aucun enseignant ne correspond/)).toBeInTheDocument();
    });

    test("deux enseignants homonymes sont distinguables sans afficher l'id", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.type(screen.getByRole("searchbox"), "karim");
        expect(cartes()).toHaveLength(2);
        expect(screen.getByText("Bureau B-101")).toBeInTheDocument();
        expect(screen.getByText("Bureau A-203")).toBeInTheDocument();
    });

    test("la fiche détaillée s'ouvre depuis la liste et n'affiche pas l'id", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants";
        render(<App />);
        await screen.findAllByRole("heading", { level: 3 });

        await userEvent.click(screen.getAllByRole("link", { name: /Salma El Idrissi/ })[0]);

        expect(await screen.findByRole("heading", { level: 1, name: "Salma El Idrissi" })).toBeInTheDocument();
        expect(screen.getByText("salma.elidrissi@example.com")).toBeInTheDocument();
        expect(screen.getByText("B-102")).toBeInTheDocument();
        expect(screen.queryByText(/Identifiant/i)).not.toBeInTheDocument();
        expect(screen.queryByText("#2")).not.toBeInTheDocument();
    });

    test("une fiche inexistante affiche le message d'erreur de l'API", async () => {
        installerFausseApi();
        window.location.hash = "#/enseignants/999";
        render(<App />);

        expect(await screen.findByText("Enseignant 999 introuvable")).toBeInTheDocument();
    });

    test("une erreur de connexion à l'API est affichée puis on peut réessayer", async () => {
        const fetchMock = installerFausseApi();
        fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
        window.location.hash = "#/enseignants";
        render(<App />);

        expect(await screen.findByText(/Impossible de joindre l'API/)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));
        await screen.findAllByRole("heading", { level: 3 });
        expect(cartes()).toHaveLength(4);
    });

    test("la page Départements regroupe les enseignants par département", async () => {
        installerFausseApi();
        window.location.hash = "#/departements";
        render(<App />);

        expect(await screen.findByRole("heading", { level: 3, name: "Informatique" })).toBeInTheDocument();
        expect(screen.getByText("2 enseignants")).toBeInTheDocument();
        expect(screen.getAllByText("1 enseignant").length).toBe(2);
    });
});