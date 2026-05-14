import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Page Guard ────────────────────────────────────────────────
// If user is NOT logged in → send them to index.html
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// ── Auto-wire the logout link ─────────────────────────────────
// Finds the .nav-item.logout element on any page and intercepts
// the click to call signOut() before navigating to index.html.
// This means NO HTML changes are needed on any page.
const logoutLink = document.querySelector(".nav-item.logout");
if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            // onAuthStateChanged above will fire with null and
            // redirect to index.html automatically
        } catch (error) {
            console.error("Logout failed:", error);
            window.location.href = "index.html";
        }
    });
}
