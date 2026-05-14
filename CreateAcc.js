import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Register form submit ──────────────────────────────────────
const form     = document.getElementById("register-form");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {

    // Stop the form from reloading the page
    e.preventDefault();

    // Clear previous error
    errorMsg.textContent = "";

    // Get values from fields
    const firstName = document.getElementById("firstname").value.trim();
    const lastName  = document.getElementById("lastname").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;
    const confirm   = document.getElementById("confirm").value;

    // ── Validation ────────────────────────────────────────────

    // 1. All fields must be filled
    if (!firstName || !lastName || !email || !password || !confirm) {
        errorMsg.textContent = "Please fill in all fields.";
        return;
    }

    // 2. Valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Please enter a valid email address.";
        return;
    }

    // 3. Password at least 8 characters
    if (password.length < 8) {
        errorMsg.textContent = "Password must be at least 8 characters.";
        return;
    }

    // 4. Passwords match
    if (password !== confirm) {
        errorMsg.textContent = "Passwords do not match.";
        return;
    }

    // ── All validation passed → create account ────────────────
    try {
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user's name in Firestore at /users/{uid}/profile
        await setDoc(doc(db, "users", user.uid, "profile", "info"), {
            firstName: firstName,
            lastName:  lastName,
            email:     email
        });

        // Success → go to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        // Handle Firebase errors with friendly messages
        if (error.code === "auth/email-already-in-use") {
            errorMsg.textContent = "This email is already registered. Try signing in.";
        } else {
            errorMsg.textContent = "Something went wrong. Please try again.";
        }
    }
});
