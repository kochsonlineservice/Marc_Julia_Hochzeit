
function getHeaderTemplate() {
    return `
        <header class="header">
            <div class="header-content">

                <a href="#home" class="logo">
                    <img src="./assets/icons/favicon.svg" alt="Herz">
                    <span>Julia & Marc</span>
                </a>

                <nav class="navigation">
                    <a href="#home">Start</a>
                    <a href="#geschichte">Unsere Geschichte</a>
                    <a href="#hochzeit">Die Hochzeit</a>
                    <a href="#ablauf">Tagesablauf</a>
                    <a href="#location">Location</a>
                    <a href="#rueckmeldung">Rückmeldung</a>
                </nav>

            </div>
        </header>
    `;
}


// =========================
// STARTBEREICH
// =========================

function getMainTemplate() {
    return `
        <section class="hero" id="home">

            <div class="hero-content">

                <div class="hero-text">

                    <p class="hero-einladung">Wir sagen</p>

                    <h1>Ja!</h1>

                    <div class="hero-namen">
                        Julia & Marc
                    </div>

                    <p class="hero-datum">
                        16. August 2027
                    </p>

                </div>

                <div class="hero-bild">
                    <img
                        src="./assets/img/julia1.png"
                        alt="Julia und Marc"
                    >
                </div>

            </div>

        </section>

        <!-- UNSERE GESCHICHTE -->

        <section class="geschichte" id="geschichte">

            <div class="geschichte-intro">

                <p class="geschichte-klein">Ein gemeinsamer Weg</p>

                <h2>Unsere Geschichte</h2>

                <div class="geschichte-deko">
                    <span></span>
                    ♡
                    <span></span>
                </div>

                <p>
                    Jeder gemeinsame Moment erzählt ein Stück
                    unserer Geschichte. Wir freuen uns darauf,
                    diesen besonderen Weg mit euch zu teilen.
                </p>

            </div>

            <div class="geschichte-bilder">

                <div class="geschichte-karte">
                    <img
                        src="./assets/img/julia1.png"
                        alt="Julia und Marc"
                    >
                    <h3>Unser Kennenlernen</h3>
                </div>

                <div class="geschichte-karte">
                    <img
                        src="./assets/img/julia1.png"
                        alt="Julia und Marc"
                    >
                    <h3>Gemeinsame Wege</h3>
                </div>

                <div class="geschichte-karte">
                    <img
                        src="./assets/img/julia1.png"
                        alt="Julia und Marc"
                    >
                    <h3>Unser Glück</h3>
                </div>

            </div>

        </section>
    `;
}


// =========================
// LOCATION
// =========================

function getLocationTemplate() {
    return `
        <section class="location">

            <h2>Unsere Location</h2>

            <h3>Sonnenhof Eventlocation</h3>

            <div class="location-images">

                <img
                    src="./assets/img/sonnenhof1.webp"
                    alt="Sonnenhof Eventlocation"
                >

                <img
                    src="./assets/img/sonnenhof2.webp"
                    alt="Sonnenhof Eventlocation"
                >

                <img
                    src="./assets/img/sonnenhof3.webp"
                    alt="Sonnenhof Eventlocation"
                >

            </div>

            <p>
                Hier feiern Marc & Julia ihren besonderen Tag.
            </p>

            <a href="./location.html" class="location-button">
                Zur Location
            </a>

        </section>
    `;
}


// =========================
// FOOTER
// =========================

function getFooterTemplate() {
    return `
        <footer>

            <p>© Marc & Julia – Unsere Hochzeit</p>

            <p>Wir freuen uns auf euch!</p>

            <a
                href="./impresum.html"
                target="_blank"
                rel="noopener"
            >
                Impressum
            </a>

        </footer>
    `;
}
