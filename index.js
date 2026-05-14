import { auth } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Auto-redirect if already logged in ───────────────────────
// isInitialLoad flag prevents redirect loop after logout
let isInitialLoad = true;

onAuthStateChanged(auth, (user) => {
    if (user && isInitialLoad) {
        // User is already logged in when page first opens → skip to dashboard
        window.location.href = "dashboard.html";
    }
    // After first check, stop auto-redirecting
    isInitialLoad = false;
});

// ── Login ─────────────────────────────────────────────────────
const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");

loginBtn.addEventListener("click", async () => {

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    errorMsg.textContent = "";

    if (!email || !password) {
        errorMsg.textContent = "Please enter your email and password.";
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
    } catch (error) {
        errorMsg.textContent = "Incorrect email or password. Please try again.";
    }
});

// ── Forgot Password — smooth expand/collapse ──────────────────
const forgotLink   = document.getElementById("forgot-link");
const resetSection = document.getElementById("reset-section");
const resetCancel  = document.getElementById("reset-cancel-btn");
const resetSend    = document.getElementById("reset-send-btn");
const resetMsg     = document.getElementById("reset-msg");

forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    resetMsg.textContent = "";
    resetMsg.className   = "reset-msg";
    document.getElementById("reset-email").value = "";
    resetSection.classList.remove("collapsed");
    resetSection.classList.add("expanded");
});

resetCancel.addEventListener("click", () => {
    resetSection.classList.remove("expanded");
    resetSection.classList.add("collapsed");
    resetMsg.textContent = "";
    resetMsg.className   = "reset-msg";
});

resetSend.addEventListener("click", async () => {

    const resetEmail = document.getElementById("reset-email").value.trim();

    resetMsg.textContent = "";
    resetMsg.className   = "reset-msg";

    if (!resetEmail) {
        resetMsg.textContent = "Please enter your email address.";
        resetMsg.classList.add("reset-msg-error");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, resetEmail);
        resetMsg.textContent = "Reset link sent! Check your inbox.";
        resetMsg.classList.add("reset-msg-success");

        setTimeout(() => {
            resetSection.classList.remove("expanded");
            resetSection.classList.add("collapsed");
            resetMsg.textContent = "";
            resetMsg.className   = "reset-msg";
        }, 3000);

    } catch (error) {
        resetMsg.textContent = "Email not found. Please check and try again.";
        resetMsg.classList.add("reset-msg-error");
    }
});