function getHeaderTemplate() {
  return `
        <header>
            <div class="header-content">

                <a href="#home" class="logo">
                    <img src="./assets/icons/favicon.svg" alt="Herz">
                    <span>Julia &  und Marc</span>
                </a>

                <nav>
                    <a href="#home">Start</a>
                    <a href="#geschichte">Unsere Geschichte</a>
                    <a href="#hochzeit">Die Hochzeit</a>
                    <a href="#ablauf">Tagesablauf</a>
                 <a href="./location.html">Location</a>
                    <a href="#rueckmeldung">Rückmeldung</a>
                </nav>

            </div>
        </header>
    `;
}

function getMainTemplate() {
  return `
        <section class="hero">
            <div class="hero-content">

                <h1>${weddingData.brautPaarName}</h1>
                <p>${weddingData.begruessung}</p>
                   <p>${weddingData.datum}</p>

                <img 
                    src="./assets/img/julia-marc.webp" 
                    alt="Julia & Marc"
                    class="hero-image"
                >

                <div id="ablauf">
                        <h2>Tagesablauf</h2>
                            <div class="ablauf-deko">
                                    <span></span>
                                    <span>♡</span>
                                    <span></span>
                </div>
</div>

            </div>
        </section>
    `;
}

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

            <p>Hier feiern Marc & Julia ihren besonderen Tag.</p>

          <a 
    href="./location.html"
    class="location-button"
>
    Zur Location
</a>
        </section>
    `;
}

function getFooterTemplate() {
  return `
        <footer>
            <p>© Marc & Julia – Unsere Hochzeit</p>
            <p>Wir freuen uns auf euch!</p>
          <a href="./impresum.html" target="_blank" rel="noopener">
    Impressum
</a>
        </footer>
    `;
}
