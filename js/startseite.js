const briefStart = document.getElementById("briefStart");
const briefOeffnen = document.getElementById("briefOeffnen");

briefOeffnen.addEventListener("click", () => {

    briefOeffnen.disabled = true;

    // 1. Briefklappe öffnen
    briefOeffnen.classList.add("geoeffnet");

    // 2. Karte herausfahren
    setTimeout(() => {
        briefOeffnen.classList.add("brief-auseinander");
    }, 1800);

    // 3. Brief und Karte ausblenden
    setTimeout(() => {
        briefStart.classList.add("brief-verschwindet");
    }, 5000);

    // 4. Erst danach die eigentliche Hochzeitsseite laden
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 6100);

});