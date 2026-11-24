
function init() {
    renderHeader();
    renderMain();
    renderLocation();
    renderFooter();
}


// =========================
// HEADER
// =========================

function renderHeader() {
    document.getElementById("header").innerHTML =
        getHeaderTemplate();
}


// =========================
// HAUPTINHALT
// =========================

function renderMain() {
    document.getElementById("content").innerHTML =
        getMainTemplate();
}


// =========================
// LOCATION
// =========================

function renderLocation() {
    document.getElementById("location").innerHTML =
        getLocationTemplate();
}


// =========================
// FOOTER
// =========================

function renderFooter() {
    document.getElementById("footer").innerHTML =
        getFooterTemplate();
}
