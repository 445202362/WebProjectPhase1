import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Page Guard ────────────────────────────────────────────────
// This file is imported by EVERY page except index.html and CreateAcc.html
// If the user is NOT logged in → redirect to login page

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// ── Logout function ───────────────────────────────────────────
// All pages share the same sidebar with a logout link
// The logout link should call: logOut()

import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.logOut = async function () {
    await signOut(auth);
    window.location.href = "index.html";
};
