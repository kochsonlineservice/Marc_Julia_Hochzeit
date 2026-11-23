
// ======================================
// HOCHZEITSDATEN
// ======================================

const weddingData = {
    brautPaarName: "Marc & Julia",
    begruessung: "Wir sagen ja ",
    datum: "16 August 2027",
};

const weddingSchedule = [
    { time: "14:00", event: "Sektempfang" },
    { time: "15:00", event: "Trauung" },
    { time: "16:00", event: "Kaffe & Kuchen" },
    { time: "18:00", event: "Abendessen" },
];


// ======================================
// FIREBASE KONFIGURATION
// ======================================

const firebaseConfig = {
    apiKey: "AIzaSyAZUjje-NUSsGW-g6l3HcSzJVIkeYd8wWs",
    authDomain: "julia-f71bf.firebaseapp.com",
    databaseURL: "https://julia-f71bf-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "julia-f71bf",
    storageBucket: "julia-f71bf.firebasestorage.app",
    messagingSenderId: "319267248897",
    appId: "1:319267248897:web:25dc0b40d0a8b9cf825900"
};


// ======================================
// FIREBASE INITIALISIEREN
// ======================================

window.firebaseReady = (async function () {

    const version = "13.3.0";
    const base = `https://www.gstatic.com/firebasejs/${version}`;

    // Firebase App

    const { initializeApp } =
        await import(`${base}/firebase-app.js`);

    // Firebase Datenbank

    const {
        getDatabase,
        ref,
        push,
        get,
        update,
        serverTimestamp
    } = await import(`${base}/firebase-database.js`);

    // Firebase Authentifizierung

    const {
        getAuth,
        onAuthStateChanged,
        signInAnonymously,
        signInWithEmailAndPassword,
        signOut
    } = await import(`${base}/firebase-auth.js`);


    // ==================================
    // APP UND DIENSTE ERSTELLEN
    // ==================================

    const app = initializeApp(firebaseConfig);

    const database = getDatabase(app);
    const auth = getAuth(app);


    // ==================================
    // AUTHENTIFIZIERUNG PRÜFEN
    // ==================================

    const user = await new Promise((resolve, reject) => {

        const unsubscribe = onAuthStateChanged(auth, async user => {

            unsubscribe();

            if (user) {
                resolve(user);
                return;
            }

            try {

                const result = await signInAnonymously(auth);

                resolve(result.user);

            } catch (error) {

                reject(error);

            }
        });
    });


    console.log("Firebase erfolgreich verbunden!");
    console.log("Angemeldeter Benutzer:", user.uid);


    // ==================================
    // FIREBASE FUNKTIONEN BEREITSTELLEN
    // ==================================

    return {
        app,
        database,
        auth,

        ref,
        push,
        get,
        update,
        serverTimestamp,

        onAuthStateChanged,
        signInWithEmailAndPassword,
        signOut
    };

})();
