
const JULIA_UID = "fKEAxTYLU8aZAb0ER745aM9lXE22";

const gaesteliste = document.getElementById("gaesteliste");
const gaestelisteKarten = document.getElementById("gaestelisteKarten");
const logoutButton = document.getElementById("logoutButton");
const exportButton = document.getElementById("exportButton");
const refreshButton = document.getElementById("refreshButton");
const pdfButton = document.getElementById("pdfButton");
const sucheGast = document.getElementById("sucheGast");
const filterTeilnahme = document.getElementById("filterTeilnahme");

let anmeldungen = [];

// Daten auch für andere JS-Module verfügbar machen
window.anmeldungen = anmeldungen;

refreshButton.addEventListener("click", async () => {
    refreshButton.disabled = true;
    refreshButton.textContent = "Wird geladen ...";

    await dashboardStarten();

    refreshButton.disabled = false;
    refreshButton.textContent = "↻ Aktualisieren";
});

sucheGast.addEventListener("input", gaestelisteAnzeigen);
filterTeilnahme.addEventListener("change", gaestelisteAnzeigen);

// Bearbeiten-Button: Ereignis an bearbeiten.js senden
function bearbeitenStarten(id) {
    const anmeldung = anmeldungen.find((gast) => gast.id === id);

    if (!anmeldung) return;

    window.dispatchEvent(new CustomEvent("anmeldungBearbeiten", {
        detail: {
            id: id,
            anmeldung: anmeldung
        }
    }));
}

// PDF erstellen
pdfButton.addEventListener("click", () => {
    const druckFenster = window.open("", "_blank");

    if (!druckFenster) {
        alert("Bitte Pop-ups erlauben.");
        return;
    }

    const zeilen = anmeldungen.map((anmeldung) => {
        const erwachsene = (anmeldung.erwachsene || [])
            .map((gast) => gast.name || "")
            .join(", ") || "-";

        const kinder = (anmeldung.kinder || [])
            .map((kind) => `${kind.name || ""} (${kind.alter ?? "?"} Jahre)`)
            .join(", ") || "-";

        return `
            <tr>
                <td>${escapeHTML(anmeldung.familienname || "-")}</td>
                <td>${anmeldung.teilnahme === "ja" ? "Zusage" : "Absage"}</td>
                <td>${escapeHTML(erwachsene)}</td>
                <td>${escapeHTML(kinder)}</td>
                <td>${anmeldung.buffet?.vegan || 0}</td>
                <td>${anmeldung.buffet?.vegetarisch || 0}</td>
            </tr>`;
    }).join("");

    druckFenster.document.write(`
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Gästeliste Marc & Julia</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 25px; }
                h1 { color: #8b1e2d; text-align: center; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 9px; text-align: left; }
                th { background: #f8f3ed; color: #8b1e2d; }
            </style>
        </head>
        <body>
            <h1>Marc & Julia</h1>
            <p>Gästeliste – 16. August 2027</p>
            <table>
                <thead>
                    <tr>
                        <th>Familie</th>
                        <th>Status</th>
                        <th>Erwachsene</th>
                        <th>Kinder</th>
                        <th>Vegan</th>
                        <th>Vegetarisch</th>
                    </tr>
                </thead>
                <tbody>${zeilen}</tbody>
            </table>
        </body>
        </html>
    `);

    druckFenster.document.close();
    druckFenster.focus();
    druckFenster.print();
});

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, (zeichen) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[zeichen]);
}

function kinderText(kinder) {
    if (!kinder.length) return "-";

    return kinder.map((kind) => {
        const kostenstatus = kind.kostenpflichtig === true
            ? "kostenpflichtig"
            : kind.kostenpflichtig === false
                ? "kostenfrei"
                : "unbekannt";

        return `${kind.name || "Ohne Namen"} (${kind.alter ?? "?"} Jahre, ${kostenstatus})`;
    }).join("\n");
}

function erwachseneText(erwachsene) {
    return erwachsene.length
        ? erwachsene.map((gast) => gast.name || "Ohne Namen").join("\n")
        : "-";
}

// Dashboard laden
async function dashboardStarten() {
    try {
        const firebase = await window.firebaseReady;
        const user = firebase.auth.currentUser;

        if (!user || user.uid !== JULIA_UID) {
            window.location.href = "./login.html";
            return;
        }

        const datenRef = firebase.ref(firebase.database, "anmeldungen");
        const snapshot = await firebase.get(datenRef);
        const daten = snapshot.val() || {};

        anmeldungen = Object.entries(daten).map(([id, anmeldung]) => ({
            id,
            ...anmeldung
        }));

        // Aktuelle Daten für bearbeiten.js bereitstellen
        window.anmeldungen = anmeldungen;

        statistikenBerechnen();
        gaestelisteAnzeigen();

    } catch (error) {
        console.error("Dashboard-Fehler:", error);
        gaesteliste.replaceChildren();
        gaestelisteKarten.textContent =
            "Die Gästedaten konnten nicht geladen werden.";
    }
}

// Statistiken berechnen
function statistikenBerechnen() {
    let zusagen = 0;
    let absagen = 0;
    let erwachsene = 0;
    let kinder = 0;
    let vegan = 0;
    let vegetarisch = 0;

    anmeldungen.forEach((anmeldung) => {
        if (anmeldung.teilnahme === "ja") {
            zusagen++;
            erwachsene += anmeldung.erwachsene?.length || 0;
            kinder += anmeldung.kinder?.length || 0;
            vegan += Number(anmeldung.buffet?.vegan || 0);
            vegetarisch += Number(anmeldung.buffet?.vegetarisch || 0);
        } else if (anmeldung.teilnahme === "nein") {
            absagen++;
        }
    });

    document.getElementById("zusagenAnzahl").textContent = zusagen;
    document.getElementById("absagenAnzahl").textContent = absagen;
    document.getElementById("erwachseneAnzahl").textContent = erwachsene;
    document.getElementById("kinderAnzahl").textContent = kinder;
    document.getElementById("veganAnzahl").textContent = vegan;
    document.getElementById("vegetarischAnzahl").textContent = vegetarisch;
}

// Gästeliste anzeigen
function gaestelisteAnzeigen() {
    gaesteliste.replaceChildren();
    gaestelisteKarten.replaceChildren();

    if (anmeldungen.length === 0) {
        zeigeTabellenMeldung("Noch keine Anmeldungen vorhanden.");
        gaestelisteKarten.textContent = "Noch keine Anmeldungen vorhanden.";
        return;
    }

    const suchbegriff = sucheGast.value.trim().toLowerCase();
    const filter = filterTeilnahme.value;

    const gefilterteAnmeldungen = anmeldungen.filter((anmeldung) => {
        const familienname = (anmeldung.familienname || "").toLowerCase();
        const namePasst = familienname.includes(suchbegriff);
        const statusPasst = filter === "alle" || anmeldung.teilnahme === filter;

        return namePasst && statusPasst;
    });

    if (gefilterteAnmeldungen.length === 0) {
        zeigeTabellenMeldung("Keine passenden Gäste gefunden.");
        gaestelisteKarten.textContent = "Keine passenden Gäste gefunden.";
        return;
    }

    gefilterteAnmeldungen.forEach((anmeldung) => {
        const erwachsene = anmeldung.erwachsene || [];
        const kinder = anmeldung.kinder || [];
        const erwachsenenNamen = erwachseneText(erwachsene);
        const kinderNamen = kinderText(kinder);
        const zusage = anmeldung.teilnahme === "ja";

        // Desktop-Tabelle
        const zeile = document.createElement("tr");

        const familienZelle = document.createElement("td");
        familienZelle.textContent = anmeldung.familienname || "-";

        const bearbeitenButton = document.createElement("button");
        bearbeitenButton.type = "button";
        bearbeitenButton.className = "gast-bearbeiten-button";
        bearbeitenButton.textContent = "Bearbeiten";

        bearbeitenButton.addEventListener("click", () => {
            bearbeitenStarten(anmeldung.id);
        });

        familienZelle.appendChild(document.createElement("br"));
        familienZelle.appendChild(bearbeitenButton);
        zeile.appendChild(familienZelle);

        const werte = [
            zusage ? "Zusage" : "Absage",
            erwachsenenNamen,
            kinderNamen,
            zusage ? (anmeldung.buffet?.vegan ?? 0) : 0,
            zusage ? (anmeldung.buffet?.vegetarisch ?? 0) : 0,
            anmeldung.nachricht || "-"
        ];

        werte.forEach((wert) => {
            const zelle = document.createElement("td");
            zelle.textContent = String(wert);
            zeile.appendChild(zelle);
        });

        gaesteliste.appendChild(zeile);

        // Smartphone-Karte
        const karte = document.createElement("article");
        karte.className = "gast-karte";

        const kopf = document.createElement("div");
        kopf.className = "gast-karte-kopf";

        const familienname = document.createElement("h3");
        familienname.textContent = anmeldung.familienname || "Ohne Familiennamen";

        const status = document.createElement("span");
        status.className = `gast-status ${
            zusage ? "gast-status-zusage" : "gast-status-absage"
        }`;
        status.textContent = zusage ? "Zusage" : "Absage";

        kopf.append(familienname, status);
        karte.appendChild(kopf);

        fuegeKartenFeldHinzu(karte, "Erwachsene", erwachsenenNamen);
        fuegeKartenFeldHinzu(karte, "Kinder", kinderNamen);

        const buffet = document.createElement("div");
        buffet.className = "gast-karte-buffet";

        fuegeKartenFeldHinzu(
            buffet,
            "Vegan",
            zusage ? (anmeldung.buffet?.vegan ?? 0) : 0
        );

        fuegeKartenFeldHinzu(
            buffet,
            "Vegetarisch",
            zusage ? (anmeldung.buffet?.vegetarisch ?? 0) : 0
        );

        karte.appendChild(buffet);

        fuegeKartenFeldHinzu(karte, "Nachricht", anmeldung.nachricht || "-");

        const kartenButton = document.createElement("button");
        kartenButton.type = "button";
        kartenButton.className = "gast-bearbeiten-button";
        kartenButton.textContent = "Anmeldung bearbeiten";

        kartenButton.addEventListener("click", () => {
            bearbeitenStarten(anmeldung.id);
        });

        karte.appendChild(kartenButton);
        gaestelisteKarten.appendChild(karte);
    });
}

function zeigeTabellenMeldung(text) {
    const zeile = document.createElement("tr");
    const zelle = document.createElement("td");

    zelle.colSpan = 7;
    zelle.textContent = text;

    zeile.appendChild(zelle);
    gaesteliste.appendChild(zeile);
}

function fuegeKartenFeldHinzu(container, titel, inhalt) {
    const feld = document.createElement("div");
    feld.className = "gast-karte-feld";

    const label = document.createElement("strong");
    label.textContent = titel;

    const wert = document.createElement("p");
    wert.textContent = String(inhalt);

    feld.append(label, wert);
    container.appendChild(feld);
}

// CSV exportieren
function gaestelisteExportieren() {
    const kopfzeile = [
        "Familie",
        "Teilnahme",
        "Erwachsene",
        "Kinder",
        "Vegan",
        "Vegetarisch",
        "Nachricht"
    ];

    const zeilen = anmeldungen.map((anmeldung) => {
        const erwachsene = (anmeldung.erwachsene || [])
            .map((gast) => gast.name || "")
            .join(", ");

        const kinder = (anmeldung.kinder || [])
            .map((kind) => {
                const kostenstatus = kind.kostenpflichtig === true
                    ? "kostenpflichtig"
                    : kind.kostenpflichtig === false
                        ? "kostenfrei"
                        : "unbekannt";

                return `${kind.name || ""} (${kind.alter ?? "?"} Jahre, ${kostenstatus})`;
            })
            .join(", ");

        return [
            anmeldung.familienname || "",
            anmeldung.teilnahme || "",
            erwachsene,
            kinder,
            anmeldung.buffet?.vegan || 0,
            anmeldung.buffet?.vegetarisch || 0,
            anmeldung.nachricht || ""
        ];
    });

    const csv = [kopfzeile, ...zeilen]
        .map((zeile) => zeile.map((wert) =>
            `"${String(wert).replace(/"/g, '""')}"`
        ).join(";"))
        .join("\r\n");

    const datei = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(datei);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Hochzeitsgaeste.csv";
    link.click();

    URL.revokeObjectURL(url);
}

logoutButton.addEventListener("click", async () => {
    try {
        const firebase = await window.firebaseReady;
        await firebase.signOut(firebase.auth);
        window.location.href = "./login.html";
    } catch (error) {
        console.error("Abmelden fehlgeschlagen:", error);
    }
});

exportButton.addEventListener("click", gaestelisteExportieren);

dashboardStarten();
