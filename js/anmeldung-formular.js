
// ======================================
// ANMELDEFORMULAR – GÄSTEDATEN
// ======================================


// ======================================
// HTML-ELEMENTE
// ======================================

const anzahlErwachsene = document.getElementById("anzahlErwachsene");
const anzahlKinder = document.getElementById("anzahlKinder");

const erwachseneContainer = document.getElementById("erwachseneContainer");
const kinderContainer = document.getElementById("kinderContainer");

const teilnahmeBereich = document.getElementById("teilnahmeBereich");

const familiennameInput = document.getElementById("familienname");
const familiennameHinweis = document.getElementById("familiennameHinweis");

const weiterZuEssen = document.getElementById("weiterZuEssen");
const absageAbsenden = document.getElementById("absageAbsenden");

const teilnahmeOptionen = document.querySelectorAll(
    'input[name="teilnahme"]'
);


// ======================================
// GASTFELDER ERSTELLEN
// ======================================

function erstelleGastfelder() {

    const erwachsene = Number(anzahlErwachsene.value);
    const kinder = Number(anzahlKinder.value);

    erwachseneContainer.innerHTML = "";
    kinderContainer.innerHTML = "";

    // Erwachsene erstellen

    if (Number.isInteger(erwachsene) && erwachsene >= 1 && erwachsene <= 20) {

        for (let i = 1; i <= erwachsene; i++) {

            erwachseneContainer.innerHTML += `
                <div class="gast-eingabe">

                    <label for="erwachsener${i}">
                        Erwachsener ${i} *
                    </label>

                    <input
                        type="text"
                        id="erwachsener${i}"
                        name="erwachsene[]"
                        placeholder="Vor- und Nachname"
                        required
                    >

                </div>
            `;
        }
    }

    // Kinder erstellen

    if (Number.isInteger(kinder) && kinder >= 0 && kinder <= 20) {

        for (let i = 1; i <= kinder; i++) {

            kinderContainer.innerHTML += `
                <div class="gast-eingabe">

                    <label for="kind${i}">
                        Name des Kindes ${i} *
                    </label>

                    <input
                        type="text"
                        id="kind${i}"
                        name="kinder[]"
                        placeholder="Vor- und Nachname"
                        required
                    >

                    <label for="alter${i}">
                        Alter des Kindes *
                    </label>

                    <input
                        type="number"
                        id="alter${i}"
                        name="alter[]"
                        min="0"
                        max="17"
                        placeholder="Alter"
                        required
                    >

                </div>
            `;
        }
    }

    pruefeFormular();
}


// ======================================
// TEILNAHME AUSLESEN
// ======================================

export function getTeilnahme() {

    const auswahl = document.querySelector(
        'input[name="teilnahme"]:checked'
    );

    return auswahl ? auswahl.value : null;
}


// ======================================
// FORMULAR PRÜFEN
// ======================================

export function pruefeFormular() {

    const teilnahme = getTeilnahme();

    const familiennameVorhanden =
        familiennameInput.value.trim() !== "";

    // Buttons zunächst ausblenden

    weiterZuEssen.hidden = true;
    absageAbsenden.hidden = true;

    weiterZuEssen.disabled = true;
    absageAbsenden.disabled = true;

    familiennameHinweis.hidden = true;

    if (!teilnahme) {
        return;
    }

    // Familienname prüfen

    if (!familiennameVorhanden) {

        familiennameHinweis.hidden = false;
        return;
    }

    // ABSAGE

    if (teilnahme === "nein") {

        absageAbsenden.hidden = false;
        absageAbsenden.disabled = false;

        return;
    }

    // ZUSAGE

    if (teilnahme === "ja") {

        weiterZuEssen.hidden = false;

        const erwachseneFelder = Array.from(
            erwachseneContainer.querySelectorAll(
                'input[name="erwachsene[]"]'
            )
        );

        const kinderNamen = Array.from(
            kinderContainer.querySelectorAll(
                'input[name="kinder[]"]'
            )
        );

        const kinderAlter = Array.from(
            kinderContainer.querySelectorAll(
                'input[name="alter[]"]'
            )
        );

        const erwachseneGueltig =
            Number.isInteger(Number(anzahlErwachsene.value)) &&
            Number(anzahlErwachsene.value) >= 1 &&
            Number(anzahlErwachsene.value) <= 20;

        const kinderGueltig =
            Number.isInteger(Number(anzahlKinder.value)) &&
            Number(anzahlKinder.value) >= 0 &&
            Number(anzahlKinder.value) <= 20;

        const alleErwachsenenEingetragen =
            erwachseneFelder.length > 0 &&
            erwachseneFelder.every(
                feld => feld.value.trim() !== ""
            );

        const alleKinderEingetragen =
            kinderNamen.every(
                feld => feld.value.trim() !== ""
            ) &&
            kinderAlter.every(
                feld =>
                    feld.value !== "" &&
                    feld.validity.valid
            );

        const formularGueltig =
            erwachseneGueltig &&
            kinderGueltig &&
            alleErwachsenenEingetragen &&
            alleKinderEingetragen;

        weiterZuEssen.disabled = !formularGueltig;
    }
}


// ======================================
// GÄSTEDATEN SAMMELN
// ======================================

export function getGastDaten() {

    const teilnahme = getTeilnahme();

    let erwachsene = [];
    let kinder = [];

    if (teilnahme === "ja") {

        erwachsene = Array.from(
            erwachseneContainer.querySelectorAll(
                'input[name="erwachsene[]"]'
            )
        ).map(input => ({
            name: input.value.trim()
        }));

        const kindNamen = kinderContainer.querySelectorAll(
            'input[name="kinder[]"]'
        );

        const kinderAlter = kinderContainer.querySelectorAll(
            'input[name="alter[]"]'
        );

        kinder = Array.from(kindNamen).map((input, index) => {

            const alter = Number(kinderAlter[index].value);

            return {
                name: input.value.trim(),
                alter: alter,
                kostenpflichtig: alter >= 4
            };
        });
    }

    return {
        familienname: familiennameInput.value.trim(),
        teilnahme,
        erwachsene,
        kinder,
        nachricht: document.getElementById("nachricht").value.trim()
    };
}



// ======================================
// EINGABEN ÜBERWACHEN
// ======================================

anzahlErwachsene.addEventListener(
    "input",
    erstelleGastfelder
);

anzahlKinder.addEventListener(
    "input",
    erstelleGastfelder
);

familiennameInput.addEventListener(
    "input",
    pruefeFormular
);

// Dynamische Gastfelder überwachen

erwachseneContainer.addEventListener(
    "input",
    pruefeFormular
);

kinderContainer.addEventListener(
    "input",
    pruefeFormular
);


// ======================================
// ZUSAGE UND ABSAGE
// ======================================

teilnahmeOptionen.forEach(option => {

    option.addEventListener("change", function () {

        if (this.value === "ja") {

            teilnahmeBereich.style.display = "block";

            teilnahmeBereich.querySelectorAll(
                "input, textarea, select"
            ).forEach(feld => {
                feld.disabled = false;
            });

        } else {

            teilnahmeBereich.style.display = "none";

            teilnahmeBereich.querySelectorAll(
                "input, textarea, select"
            ).forEach(feld => {
                feld.disabled = true;
            });
        }

        pruefeFormular();
    });
});


// ======================================
// START
// ======================================

erstelleGastfelder();
pruefeFormular();
