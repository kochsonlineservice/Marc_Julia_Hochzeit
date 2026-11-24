
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
                  <a href="./rueckmeldung.html">Rückmeldung</a>
                </nav>

            </div>
        </header>
    `;
}


// =========================
// STARTBEREICH UND INHALT
// =========================

function getMainTemplate() {
    return `
        <!-- STARTBEREICH -->

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


        <!-- UNSERE HOCHZEIT -->

        <section class="hochzeit" id="hochzeit">

            <div class="hochzeit-intro">

                <p class="hochzeit-klein">Ein besonderer Tag</p>

                <h2>Unsere Hochzeit</h2>

                <div class="hochzeit-deko"></div>

                <p>
                    Wir freuen uns darauf, diesen besonderen Tag
                    gemeinsam mit euch zu feiern.
                </p>

            </div>

            <div class="hochzeit-infos">

                <div class="hochzeit-info">
                    <span class="hochzeit-icon">♡</span>
                    <h3>Wann?</h3>
                    <p>16. August 2027</p>
                </div>

                <div class="hochzeit-info">
                    <span class="hochzeit-icon">♡</span>
                    <h3>Wo?</h3>
                    <p>Sonnenhof Eventlocation</p>
                </div>

                <div class="hochzeit-info">
                    <span class="hochzeit-icon">♡</span>
                    <h3>Mit wem?</h3>
                    <p>Mit unseren Lieblingsmenschen</p>
                </div>

            </div>

        </section>


        <!-- TAGESABLAUF -->

        <section class="ablauf" id="ablauf">

            <div class="ablauf-intro">

                <p class="ablauf-klein">Gemeinsam feiern</p>

                <h2>Unser Tagesablauf</h2>

                <div class="ablauf-deko"></div>

                <p>
                    Ein Tag voller Liebe, Freude und
                    unvergesslicher Momente.
                </p>

            </div>

            <div class="ablauf-liste">

                <div class="ablauf-punkt">
                    <span class="ablauf-uhrzeit">14:00</span>
                    <div class="ablauf-details">
                        <h3>Sektempfang</h3>
                        <p>Wir begrüßen unsere Gäste.</p>
                    </div>
                </div>

                <div class="ablauf-punkt">
                    <span class="ablauf-uhrzeit">15:00</span>
                    <div class="ablauf-details">
                        <h3>Trauung</h3>
                        <p>Der schönste Moment unseres Tages.</p>
                    </div>
                </div>

                <div class="ablauf-punkt">
                    <span class="ablauf-uhrzeit">16:00</span>
                    <div class="ablauf-details">
                        <h3>Kaffee & Kuchen</h3>
                        <p>Gemeinsam genießen und feiern.</p>
                    </div>
                </div>

                <div class="ablauf-punkt">
                    <span class="ablauf-uhrzeit">18:00</span>
                    <div class="ablauf-details">
                        <h3>Abendessen</h3>
                        <p>Ein gemütlicher Abend mit unseren Gästen.</p>
                    </div>
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
        <section class="location" id="location">

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
