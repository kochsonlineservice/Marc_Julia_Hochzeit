
const JULIA_UID = "fKEAxTYLU8aZAb0ER745aM9lXE22";

// HTML-Elemente
const gaesteliste = document.getElementById("gaesteliste");
const logoutButton = document.getElementById("logoutButton");
const exportButton = document.getElementById("exportButton");

// Gespeicherte Anmeldungen für den Export
let anmeldungen = [];

// ======================================
// DASHBOARD STARTEN
// ======================================

async function dashboardStarten() {
    try {
        const firebase = await window.firebaseReady;

        // Zugriff prüfen
        const user = firebase.auth.currentUser;

        if (!user || user.uid !== JULIA_UID) {
            window.location.href = "./login.html";
            return;
        }

        // Daten aus Firebase laden
        const datenRef = firebase.ref(firebase.database, "anmeldungen");
        const snapshot = await firebase.get(datenRef);

        const daten = snapshot.val() || {};

        anmeldungen = Object.values(daten);

        statistikenBerechnen();
        gaestelisteAnzeigen();

    } catch (error) {
        console.error("Dashboard-Fehler:", error);

        gaesteliste.textContent =
            "Die Gästedaten konnten nicht geladen werden.";
    }
}

// ======================================
// STATISTIKEN BERECHNEN
// ======================================

function statistikenBerechnen() {

    let zusagen = 0;
    let absagen = 0;
    let erwachsene = 0;
    let kinder = 0;
    let vegan = 0;
    let vegetarisch = 0;

    anmeldungen.forEach(anmeldung => {

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

// ======================================
// GÄSTELISTE ANZEIGEN
// ======================================

function gaestelisteAnzeigen() {

    gaesteliste.replaceChildren();

    if (anmeldungen.length === 0) {
        const zeile = document.createElement("tr");
        const zelle = document.createElement("td");

        zelle.colSpan = 7;
        zelle.textContent = "Noch keine Anmeldungen vorhanden.";

        zeile.appendChild(zelle);
        gaesteliste.appendChild(zeile);
        return;
    }

    anmeldungen.forEach(anmeldung => {

        const zeile = document.createElement("tr");

        const erwachsene = anmeldung.erwachsene?.length || 0;
        const kinder = anmeldung.kinder?.length || 0;

        const werte = [
            anmeldung.familienname || "-",
            anmeldung.teilnahme === "ja" ? "Zusage" : "Absage",
            erwachsene,
            kinder,
            anmeldung.teilnahme === "ja"
                ? anmeldung.buffet?.vegan ?? 0
                : 0,
            anmeldung.teilnahme === "ja"
                ? anmeldung.buffet?.vegetarisch ?? 0
                : 0,
            anmeldung.nachricht || "-"
        ];

        werte.forEach(wert => {
            const zelle = document.createElement("td");
            zelle.textContent = String(wert);
            zeile.appendChild(zelle);
        });

        gaesteliste.appendChild(zeile);
    });
}

// ======================================
// CSV EXPORT
// ======================================

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

    const zeilen = anmeldungen.map(anmeldung => [
        anmeldung.familienname || "",
        anmeldung.teilnahme || "",
        anmeldung.erwachsene?.length || 0,
        anmeldung.kinder?.length || 0,
        anmeldung.buffet?.vegan || 0,
        anmeldung.buffet?.vegetarisch || 0,
        anmeldung.nachricht || ""
    ]);

    const csv = [kopfzeile, ...zeilen]
        .map(zeile =>
            zeile.map(wert =>
                `"${String(wert).replace(/"/g, '""')}"`
            ).join(";")
        )
        .join("\r\n");

    const datei = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(datei);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Hochzeitsgaeste.csv";
    link.click();

    URL.revokeObjectURL(url);
}

// ======================================
// ABMELDEN
// ======================================

logoutButton.addEventListener("click", async () => {

    try {
        const firebase = await window.firebaseReady;

        await firebase.signOut(firebase.auth);

        window.location.href = "./login.html";

    } catch (error) {
        console.error("Abmelden fehlgeschlagen:", error);
    }
});

// Export-Button
exportButton.addEventListener("click", gaestelisteExportieren);

// Dashboard starten
dashboardStarten();
