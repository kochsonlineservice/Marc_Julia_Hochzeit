
const JULIA_UID = "fKEAxTYLU8aZAb0ER745aM9lXE22";

const loginForm = document.getElementById("loginForm");
const loginFehler = document.getElementById("loginFehler");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginFehler.hidden = true;
    loginButton.disabled = true;
    loginButton.textContent = "Anmeldung läuft ...";

    try {
        const firebase = await window.firebaseReady;

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const result = await firebase.signInWithEmailAndPassword(
            firebase.auth,
            email,
            password
        );

        if (result.user.uid !== JULIA_UID) {
            await firebase.signOut(firebase.auth);
            throw new Error("Dieses Konto hat keinen Admin-Zugang.");
        }

        window.location.href = "./dashboard.html";

    } catch (error) {
        console.error("Login-Fehler:", error);

        loginFehler.textContent =
            "Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.";

        loginFehler.hidden = false;

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Anmelden";
    }
});


