const briefStart = document.getElementById("briefStart");
const briefOeffnen = document.getElementById("briefOeffnen");
const hochzeitsseite = document.getElementById("hochzeitsseite");

briefOeffnen.addEventListener("click", () => {

    // Mehrfaches Klicken verhindern
    briefOeffnen.disabled = true;

    // Phase 1: Briefklappe öffnen
    briefOeffnen.classList.add("geoeffnet");

    // Phase 2: Karte herausziehen und Umschlag öffnen
    setTimeout(() => {
        briefOeffnen.classList.add("brief-auseinander");
    }, 1800);

    // Phase 3: Umschlag ausblenden
    setTimeout(() => {
        briefStart.classList.add("brief-verschwindet");
    }, 3600);

    // Phase 4: Hochzeitsseite anzeigen
    setTimeout(() => {
        briefStart.style.display = "none";

        hochzeitsseite.hidden = false;

        requestAnimationFrame(() => {
            hochzeitsseite.classList.add("seite-sichtbar");
        });

        window.scrollTo(0, 0);

    }, 4600);

});