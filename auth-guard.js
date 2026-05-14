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

// ── Logout ────────────────────────────────────────────────────
// Waits for Firebase to fully sign out FIRST, then redirects
// This prevents the bug where logout immediately logs you back in
window.logOut = async function () {
    try {
        await signOut(auth);
        // Only redirect AFTER Firebase confirms sign out is complete
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
