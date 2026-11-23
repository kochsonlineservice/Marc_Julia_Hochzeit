
const bearbeitenEvent = "anmeldungBearbeiten";

let aktuelleAnmeldung = null;
let erwachseneBearbeiten = [];
let kinderBearbeiten = [];

// HTML-Sonderzeichen sicher darstellen
function escapeHTML(text) {
    return String(text ?? "").replace(/[&<>"']/g, (zeichen) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[zeichen]);
}

// Erwachsene anzeigen
function erwachseneRendern() {
    const container = document.getElementById("editErwachsene");

    container.innerHTML = erwachseneBearbeiten.map((person, index) => `
        <div class="erwachsenen-zeile">
            <input
                type="text"
                class="erwachsenen-name"
                data-index="${index}"
                value="${escapeHTML(person.name)}"
                placeholder="Name des Erwachsenen"
                required
            >

            <button
                type="button"
                class="erwachsenen-loeschen"
                data-index="${index}"
            >
                Löschen
            </button>
        </div>
    `).join("");
}

// Bereits hinzugefügte Kinder anzeigen
function kinderRendern() {
    const container = document.getElementById("editKinder");

    container.innerHTML = kinderBearbeiten.map((kind, index) => `
        <div class="kind-bearbeiten">
            <div class="kind-eingaben">
                <div class="kind-name">
                    <label>Name des Kindes</label>
                    <input
                        type="text"
                        class="kind-name-input"
                        data-index="${index}"
                        value="${escapeHTML(kind.name)}"
                        placeholder="Name des Kindes"
                        required
                    >
                </div>

                <div class="kind-alter">
                    <label>Alter</label>
                    <input
                        type="number"
                        class="kind-alter-input"
                        data-index="${index}"
                        value="${kind.alter}"
                        min="0"
                        step="1"
                        required
                    >
                </div>

                <button
                    type="button"
                    class="kind-loeschen"
                    data-index="${index}"
                >
                    Löschen
                </button>
            </div>
        </div>
    `).join("");
}

// Erwachsene aus dem Formular lesen
function erwachseneAusFormLesen() {
    const inputs = document.querySelectorAll(".erwachsenen-name");

    erwachseneBearbeiten = Array.from(inputs).map((input) => ({
        name: input.value.trim()
    }));
}

// Kinder aus dem Formular lesen
function kinderAusFormLesen() {
    const kinderContainer = document.getElementById("editKinder");

    if (!kinderContainer) return;

    const kinderZeilen = kinderContainer.querySelectorAll(".kind-bearbeiten");

    kinderBearbeiten = Array.from(kinderZeilen).map((zeile, index) => ({
        name: zeile.querySelector(".kind-name-input").value.trim(),
        alter: Number(zeile.querySelector(".kind-alter-input").value),

        // Vorhandenen Firebase-Wert erhalten
        kostenpflichtig: kinderBearbeiten[index]?.kostenpflichtig ?? false
    }));
}

// Neues Kind hinzufügen
function neuesKindHinzufuegen() {
    const nameFeld = document.getElementById("neuesKindName");
    const alterFeld = document.getElementById("neuesKindAlter");
    const fehlerAnzeige = document.getElementById("bearbeitenFehler");

    const name = nameFeld.value.trim();
    const alter = Number(alterFeld.value);

    if (!name) {
        fehlerAnzeige.textContent = "Bitte den Namen des Kindes eingeben.";
        nameFeld.focus();
        return;
    }

    if (
        alterFeld.value === "" ||
        !Number.isInteger(alter) ||
        alter < 0
    ) {
        fehlerAnzeige.textContent = "Bitte ein gültiges Alter eingeben.";
        alterFeld.focus();
        return;
    }

    kinderAusFormLesen();

    kinderBearbeiten.push({
        name: name,
        alter: alter,
        kostenpflichtig: false
    });

    kinderRendern();

    nameFeld.value = "";
    alterFeld.value = "";

    fehlerAnzeige.textContent = "";

    nameFeld.focus();
}

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

                <div class="bearbeiten-personen">
                    <h3>Erwachsene</h3>

                    <div id="editErwachsene"></div>

                    <button
                        type="button"
                        id="erwachsenenHinzufuegen"
                        class="erwachsenen-hinzufuegen"
                    >
                        + Erwachsenen hinzufügen
                    </button>
                </div>

                <div class="bearbeiten-personen">
                    <h3>Kinder</h3>

                    <div id="editKinder"></div>

                    <div class="kind-neu-eingabe">
                        <div class="kind-eingaben">
                            <div class="kind-name">
                                <label for="neuesKindName">
                                    Name des Kindes
                                </label>
                                <input
                                    type="text"
                                    id="neuesKindName"
                                    placeholder="Name des Kindes"
                                >
                            </div>

                            <div class="kind-alter">
                                <label for="neuesKindAlter">Alter</label>
                                <input
                                    type="number"
                                    id="neuesKindAlter"
                                    min="0"
                                    step="1"
                                    placeholder="Alter"
                                >
                            </div>

                            <button
                                type="button"
                                id="kindHinzufuegen"
                                class="kind-hinzufuegen"
                            >
                                Hinzufügen
                            </button>
                        </div>
                    </div>
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

    // Erwachsenen hinzufügen
    document.getElementById("erwachsenenHinzufuegen")
        .addEventListener("click", () => {
            erwachseneAusFormLesen();

            erwachseneBearbeiten.push({ name: "" });

            erwachseneRendern();
        });

    // Erwachsenen löschen
    document.getElementById("editErwachsene")
        .addEventListener("click", (event) => {
            const button = event.target.closest(".erwachsenen-loeschen");

            if (!button) return;

            erwachseneAusFormLesen();

            const index = Number(button.dataset.index);

            erwachseneBearbeiten =
                erwachseneBearbeiten.filter((person, i) => i !== index);

            erwachseneRendern();
        });

    // Neues Kind hinzufügen
    document.getElementById("kindHinzufuegen")
        .addEventListener("click", neuesKindHinzufuegen);

    // Enter im neuen Kinderformular fügt das Kind hinzu
    document.getElementById("neuesKindName")
        .addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                neuesKindHinzufuegen();
            }
        });

    document.getElementById("neuesKindAlter")
        .addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                neuesKindHinzufuegen();
            }
        });

    // Bereits hinzugefügtes Kind löschen
    document.getElementById("editKinder")
        .addEventListener("click", (event) => {
            const button = event.target.closest(".kind-loeschen");

            if (!button) return;

            kinderAusFormLesen();

            const index = Number(button.dataset.index);

            kinderBearbeiten =
                kinderBearbeiten.filter((kind, i) => i !== index);

            kinderRendern();
        });

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            bearbeitenSchliessen();
        }
    });
}

// Bearbeitungsfenster öffnen
function bearbeitenOeffnen(anmeldung) {
    aktuelleAnmeldung = anmeldung;

    erwachseneBearbeiten = (anmeldung.erwachsene || []).map((person) => ({
        name: person.name || ""
    }));

    kinderBearbeiten = (anmeldung.kinder || []).map((kind) => ({
        name: kind.name || "",
        alter: Number(kind.alter) || 0,
        kostenpflichtig: kind.kostenpflichtig ?? false
    }));

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

    document.getElementById("neuesKindName").value = "";
    document.getElementById("neuesKindAlter").value = "";

    erwachseneRendern();
    kinderRendern();

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
    erwachseneBearbeiten = [];
    kinderBearbeiten = [];
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

    erwachseneAusFormLesen();
    kinderAusFormLesen();

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

    if (erwachseneBearbeiten.some((person) => !person.name)) {
        fehlerAnzeige.textContent =
            "Bitte bei allen Erwachsenen einen Namen eingeben.";
        return;
    }

    if (kinderBearbeiten.some((kind) =>
        !kind.name ||
        !Number.isInteger(kind.alter) ||
        kind.alter < 0
    )) {
        fehlerAnzeige.textContent =
            "Bitte bei allen Kindern einen Namen und ein gültiges Alter eingeben.";
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
            erwachsene: erwachseneBearbeiten,
            kinder: kinderBearbeiten,
            buffet: {
                ...(aktuelleAnmeldung.buffet || {}),
                vegan: vegan,
                vegetarisch: vegetarisch
            },
            nachricht: nachricht
        });

        alert("Die Anmeldung wurde erfolgreich gespeichert.");

        bearbeitenSchliessen();

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
