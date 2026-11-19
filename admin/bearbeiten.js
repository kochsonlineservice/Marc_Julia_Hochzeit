
const bearbeitenEvent = "anmeldungBearbeiten";

let aktuelleAnmeldung = null;

// Bearbeitungsfenster erstellen
function bearbeitungsfensterErstellen() {
    if (document.getElementById("bearbeitenOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "bearbeitenOverlay";
    overlay.className = "bearbeiten-overlay";

    overlay.innerHTML = `
        <div class="bearbeiten-fenster">
            <div class="bearbeiten-kopf">
                <h2>Anmeldung bearbeiten</h2>
                <button type="button" id="bearbeitenSchliessen">×</button>
            </div>

            <form id="bearbeitenFormular">
                <div class="bearbeiten-feld">
                    <label for="editFamilienname">Familienname</label>
                    <input type="text" id="editFamilienname" required>
                </div>

                <div class="bearbeiten-feld">
                    <label for="editTeilnahme">Teilnahme</label>
                    <select id="editTeilnahme">
                        <option value="ja">Zusage</option>
                        <option value="nein">Absage</option>
                    </select>
                </div>

                <div class="bearbeiten-feld">
                    <label for="editVegan">Vegan</label>
                    <input type="number" id="editVegan" min="0" value="0">
                </div>

                <div class="bearbeiten-feld">
                    <label for="editVegetarisch">Vegetarisch</label>
                    <input type="number" id="editVegetarisch" min="0" value="0">
                </div>

                <div class="bearbeiten-feld">
                    <label for="editNachricht">Nachricht</label>
                    <textarea id="editNachricht" rows="4"></textarea>
                </div>

                <p id="bearbeitenFehler" class="bearbeiten-fehler"></p>

                <div class="bearbeiten-aktionen">
                    <button type="button" id="bearbeitenAbbrechen">
                        Abbrechen
                    </button>

                    <button type="submit" id="bearbeitenSpeichern">
                        Änderungen speichern
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("bearbeitenSchliessen")
        .addEventListener("click", bearbeitenSchliessen);

    document.getElementById("bearbeitenAbbrechen")
        .addEventListener("click", bearbeitenSchliessen);

    document.getElementById("bearbeitenFormular")
        .addEventListener("submit", anmeldungSpeichern);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            bearbeitenSchliessen();
        }
    });
}

// Bearbeitungsfenster öffnen
function bearbeitenOeffnen(anmeldung) {
    aktuelleAnmeldung = anmeldung;

    bearbeitungsfensterErstellen();

    document.getElementById("editFamilienname").value =
        anmeldung.familienname || "";

    document.getElementById("editTeilnahme").value =
        anmeldung.teilnahme || "ja";

    document.getElementById("editVegan").value =
        anmeldung.buffet?.vegan || 0;

    document.getElementById("editVegetarisch").value =
        anmeldung.buffet?.vegetarisch || 0;

    document.getElementById("editNachricht").value =
        anmeldung.nachricht || "";

    document.getElementById("bearbeitenFehler").textContent = "";

    document.getElementById("bearbeitenOverlay").classList.add("aktiv");
}

// Bearbeitungsfenster schließen
function bearbeitenSchliessen() {
    const overlay = document.getElementById("bearbeitenOverlay");

    if (overlay) {
        overlay.classList.remove("aktiv");
    }

    aktuelleAnmeldung = null;
}

// Änderungen in Firebase speichern
async function anmeldungSpeichern(event) {
    event.preventDefault();

    if (!aktuelleAnmeldung) return;

    const speichernButton =
        document.getElementById("bearbeitenSpeichern");

    const fehlerAnzeige =
        document.getElementById("bearbeitenFehler");

    const familienname =
        document.getElementById("editFamilienname").value.trim();

    const teilnahme =
        document.getElementById("editTeilnahme").value;

    const vegan =
        Number(document.getElementById("editVegan").value);

    const vegetarisch =
        Number(document.getElementById("editVegetarisch").value);

    const nachricht =
        document.getElementById("editNachricht").value.trim();

    if (!familienname) {
        fehlerAnzeige.textContent = "Bitte einen Familiennamen eingeben.";
        return;
    }

    if (
        !Number.isInteger(vegan) ||
        !Number.isInteger(vegetarisch) ||
        vegan < 0 ||
        vegetarisch < 0
    ) {
        fehlerAnzeige.textContent =
            "Bitte gültige Buffet-Anzahlen eingeben.";
        return;
    }

    speichernButton.disabled = true;
    speichernButton.textContent = "Wird gespeichert ...";

    try {
        const firebase = await window.firebaseReady;

        const anmeldungRef = firebase.ref(
            firebase.database,
            `anmeldungen/${aktuelleAnmeldung.id}`
        );

        await firebase.update(anmeldungRef, {
            familienname: familienname,
            teilnahme: teilnahme,
            buffet: {
                ...(aktuelleAnmeldung.buffet || {}),
                vegan: vegan,
                vegetarisch: vegetarisch
            },
            nachricht: nachricht
        });

        alert("Die Anmeldung wurde erfolgreich gespeichert.");

        bearbeitenSchliessen();

        // Dashboard neu laden
        document.getElementById("refreshButton").click();

    } catch (error) {
        console.error("Fehler beim Speichern:", error);

        fehlerAnzeige.textContent =
            "Speichern fehlgeschlagen. Bitte versuche es erneut.";

    } finally {
        speichernButton.disabled = false;
        speichernButton.textContent = "Änderungen speichern";
    }
}

// Ereignis aus dashboard.js empfangen
window.addEventListener(bearbeitenEvent, (event) => {
    bearbeitenOeffnen(event.detail.anmeldung);
});
