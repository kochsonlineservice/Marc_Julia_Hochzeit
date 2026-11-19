
// ======================================
// ANMELDUNG – BUFFET
// ======================================

import {
    getGastDaten,
    pruefeFormular
} from "./anmeldung-formular.js";


// ======================================
// HTML-ELEMENTE
// ======================================

const anmeldeSchritt1 = document.getElementById("anmeldeSchritt1");
const anmeldeSchritt2 = document.getElementById("anmeldeSchritt2");

const weiterZuEssen = document.getElementById("weiterZuEssen");
const zurueckZuGaesten = document.getElementById("zurueckZuGaesten");

const anzahlVegan = document.getElementById("anzahlVegan");
const anzahlVegetarisch = document.getElementById("anzahlVegetarisch");

const buffetFehler = document.getElementById("buffetFehler");


// ======================================
// GESAMTZAHL DER GÄSTE
// ======================================

function getGesamtzahlGaeste() {

    const gastDaten = getGastDaten();

    return gastDaten.erwachsene.length + gastDaten.kinder.length;
}


// ======================================
// BUFFET-ANGABEN PRÜFEN
// ======================================

export function pruefeBuffet() {

    const gesamtGaeste = getGesamtzahlGaeste();

    const vegan = Number(anzahlVegan.value);
    const vegetarisch = Number(anzahlVegetarisch.value);

    const gueltigeEingaben =
        anzahlVegan.value !== "" &&
        anzahlVegetarisch.value !== "" &&
        Number.isInteger(vegan) &&
        Number.isInteger(vegetarisch) &&
        vegan >= 0 &&
        vegetarisch >= 0;

    const gesamtzahlGueltig =
        vegan + vegetarisch <= gesamtGaeste;

    const buffetGueltig =
        gueltigeEingaben && gesamtzahlGueltig;

    buffetFehler.hidden = buffetGueltig;

    return buffetGueltig;
}


// ======================================
// ZUM BUFFET WECHSELN
// ======================================

weiterZuEssen.addEventListener("click", function () {

    console.log("Klick auf Essen Auswahl erkannt!");

    pruefeFormular();

    if (weiterZuEssen.disabled) {
        return;
    }

    const gesamtGaeste = getGesamtzahlGaeste();

    anzahlVegan.max = gesamtGaeste;
    anzahlVegetarisch.max = gesamtGaeste;

    anmeldeSchritt1.hidden = true;
    anmeldeSchritt2.hidden = false;

    buffetFehler.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    anzahlVegan.focus();
});

// ======================================
// ZURÜCK ZU DEN GÄSTEDATEN
// ======================================

zurueckZuGaesten.addEventListener("click", function () {

    anmeldeSchritt2.hidden = true;
    anmeldeSchritt1.hidden = false;

    buffetFehler.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ======================================
// BUFFET-EINGABEN ÜBERWACHEN
// ======================================

anzahlVegan.addEventListener("input", pruefeBuffet);

anzahlVegetarisch.addEventListener("input", pruefeBuffet);


// ======================================
// BUFFET-DATEN BEREITSTELLEN
// ======================================

export function getBuffetDaten() {

    return {
        vegan: Number(anzahlVegan.value),
        vegetarisch: Number(anzahlVegetarisch.value)
    };
}
