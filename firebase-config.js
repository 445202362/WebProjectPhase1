

import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }         from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Project credentials ───────────────────────────────────────
const firebaseConfig = {
    apiKey:            "AIzaSyASKn159VOmTbt1t_irCrbeBQywVRvl5YI",
    authDomain:        "brainroute-3993f.firebaseapp.com",
    projectId:         "brainroute-3993f",
    storageBucket:     "brainroute-3993f.firebasestorage.app",
    messagingSenderId: "732116895610",
    appId:             "1:732116895610:web:d2a58fa64c8e1805ee78c3"
};

// ── Initialise services ───────────────────────────────────────
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Export for use in every other file ───────────────────────
export { app, auth, db };