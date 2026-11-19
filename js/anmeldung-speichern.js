
// ======================================
// ANMELDUNG – SPEICHERN
// ======================================

import {
    getTeilnahme,
    getGastDaten,
    pruefeFormular
} from "./anmeldung-formular.js";

import {
    getBuffetDaten,
    pruefeBuffet
} from "./anmeldung-buffett.js";


// ======================================
// HTML-ELEMENTE
// ======================================

const anmeldeformular = document.getElementById("anmeldeformular");

const anmeldeSchritt2 = document.getElementById("anmeldeSchritt2");

const absageAbsenden = document.getElementById("absageAbsenden");
const finalAbsenden = document.getElementById("finalAbsenden");

const familiennameInput = document.getElementById("familienname");

const absageDialog = document.getElementById("absageDialog");
const absageSchliessen = document.getElementById("absageSchliessen");

const erfolgDialog = document.getElementById("erfolgDialog");
const erfolgSchliessen = document.getElementById("erfolgSchliessen");


// ======================================
// ERFOLGSDIALOG ANZEIGEN
// ======================================

function zeigeErfolgDialog() {

    erfolgDialog.hidden = false;

    requestAnimationFrame(() => {
        erfolgDialog.classList.add("aktiv");
    });

    erfolgSchliessen.focus();
}


// ======================================
// ANMELDUNGSDATEN ZUSAMMENFÜHREN
// ======================================

function sammleAnmeldedaten() {

    const gastDaten = getGastDaten();
    const teilnahme = getTeilnahme();

    const buffetDaten = teilnahme === "ja"
        ? getBuffetDaten()
        : {
            vegan: 0,
            vegetarisch: 0
        };

    return {
        ...gastDaten,
        buffet: buffetDaten,
        erstelltAm: null
    };
}


// ======================================
// FORMULAR AN FIREBASE SENDEN
// ======================================

anmeldeformular.addEventListener("submit", async function (event) {

    event.preventDefault();

    const teilnahme = getTeilnahme();

    // Teilnahme prüfen

    if (!teilnahme) {
        return;
    }

    // ==================================
    // ABSAGE PRÜFEN
    // ==================================

    if (teilnahme === "nein") {

        pruefeFormular();

        if (absageAbsenden.disabled) {
            familiennameInput.focus();
            return;
        }
    }


    // ==================================
    // ZUSAGE PRÜFEN
    // ==================================

    if (teilnahme === "ja") {

        // Buffet-Schritt muss geöffnet sein

        if (anmeldeSchritt2.hidden) {
            return;
        }

        // Buffet-Angaben prüfen

        if (!pruefeBuffet()) {

            document.getElementById("buffetFehler").hidden = false;

            document.getElementById("anzahlVegan").focus();

            return;
        }
    }


    // ==================================
    // BROWSER-VALIDIERUNG
    // ==================================

    if (!anmeldeformular.checkValidity()) {

        anmeldeformular.reportValidity();
        return;
    }


    // ==================================
    // DATEN SAMMELN
    // ==================================

    const anmeldedaten = sammleAnmeldedaten();

    const aktiverButton = teilnahme === "nein"
        ? absageAbsenden
        : finalAbsenden;

    const buttonText = aktiverButton.textContent;

    aktiverButton.disabled = true;
    aktiverButton.textContent = "Wird gesendet ...";


    try {

        // Auf Firebase warten

        const firebase = await window.firebaseReady;

        // Zeitstempel setzen

        anmeldedaten.erstelltAm =
            firebase.serverTimestamp();

        // Datenbankpfad bestimmen

        const anmeldungenRef = firebase.ref(
            firebase.database,
            "anmeldungen"
        );

        // Anmeldung speichern

        await firebase.push(
            anmeldungenRef,
            anmeldedaten
        );


        // ==================================
        // PASSENDEN DIALOG ANZEIGEN
        // ==================================

        if (teilnahme === "nein") {

            absageDialog.classList.add("aktiv");

        } else {

            zeigeErfolgDialog();

        }

    } catch (error) {

        console.error("Firebase Speicherfehler:", error);

        alert(
            "Die Anmeldung konnte leider nicht gespeichert werden. Bitte versuche es später erneut."
        );

        aktiverButton.disabled = false;

    } finally {

        aktiverButton.textContent = buttonText;

    }

});


// ======================================
// DIALOGE SCHLIESSEN
// ======================================

absageSchliessen.addEventListener("click", function () {
    window.location.reload();
});

erfolgSchliessen.addEventListener("click", function () {
    window.location.reload();
});
