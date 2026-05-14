// ─────────────────────────────────────────────────────────────
//  reseed.js
//  BrainRoute — Group 8
//  Run ONCE. Signs into the existing demo account and writes
//  all Firestore collections. Remove script tag after running.
//  Demo credentials: demo@brainroute.com / Demo1234!
// ─────────────────────────────────────────────────────────────

import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword }                    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const DEMO_EMAIL    = "demo@brainroute.com";
const DEMO_PASSWORD = "Demo1234!";

// ── Helper: clear a collection before reseeding ───────────────
async function clearCollection(uid, col) {
    const snap = await getDocs(collection(db, "users", uid, col));
    const deletions = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletions);
}

// ── Helper: add a document to a sub-collection ────────────────
async function add(uid, col, data) {
    return await addDoc(collection(db, "users", uid, col), data);
}

// ── Main ──────────────────────────────────────────────────────
async function reseed() {
    try {
        // 1. Sign in with existing demo account
        const cred = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
        const uid  = cred.user.uid;
        console.log("Signed in. UID:", uid);

        // 2. Clear any existing collections first
        await clearCollection(uid, "courses");
        await clearCollection(uid, "deadlines");
        await clearCollection(uid, "availability");
        await clearCollection(uid, "studyPlan");
        console.log("Old data cleared.");

        // 3. Profile
        await setDoc(doc(db, "users", uid, "profile", "info"), {
            firstName: "Demo",
            lastName:  "Student",
            email:     DEMO_EMAIL
        });

        // 4. Courses
        await add(uid, "courses", { code:"CSC111",  name:"Introduction to Java",    studyDays:["Sun","Tue","Thu"], assignments:3, exams:2 });
        await add(uid, "courses", { code:"MATH203", name:"Discrete Mathematics",    studyDays:["Mon","Wed"],       assignments:5, exams:1 });
        await add(uid, "courses", { code:"ENG305",  name:"Technical Writing",       studyDays:["Sun","Thu"],       assignments:4, exams:1 });
        await add(uid, "courses", { code:"SWE381",  name:"Web App Development",     studyDays:["Mon","Wed","Fri"], assignments:2, exams:1 });
        console.log("Courses written.");

        // 5. Deadlines — dates relative to today
        const today = new Date();
        function daysFromNow(n) {
            const d = new Date(today);
            d.setDate(d.getDate() + n);
            return d.toISOString().split("T")[0];
        }

        await add(uid, "deadlines", { courseCode:"CSC111",  title:"Project Phase 2",  dueDate:daysFromNow(3),  type:"Project",    time:"23:59", priority:"High"   });
        await add(uid, "deadlines", { courseCode:"MATH203", title:"Midterm Exam",      dueDate:daysFromNow(6),  type:"Exam",       time:"10:00", priority:"High"   });
        await add(uid, "deadlines", { courseCode:"ENG305",  title:"Essay Draft",       dueDate:daysFromNow(10), type:"Assignment", time:"23:59", priority:"Medium" });
        await add(uid, "deadlines", { courseCode:"SWE381",  title:"Demo 2 Submission", dueDate:daysFromNow(14), type:"Project",    time:"23:59", priority:"Medium" });
        await add(uid, "deadlines", { courseCode:"CSC111",  title:"Quiz 3",            dueDate:daysFromNow(18), type:"Quiz",       time:"09:00", priority:"Low"    });
        console.log("Deadlines written.");

        // 6. Availability
        await add(uid, "availability", { day:"Sunday",    from:"08:00", to:"14:00" });
        await add(uid, "availability", { day:"Monday",    from:"16:00", to:"20:00" });
        await add(uid, "availability", { day:"Tuesday",   from:"08:00", to:"12:00" });
        await add(uid, "availability", { day:"Wednesday", from:"16:00", to:"20:00" });
        await add(uid, "availability", { day:"Thursday",  from:"08:00", to:"13:00" });
        await add(uid, "availability", { day:"Every Day", from:"21:00", to:"23:00" });
        console.log("Availability written.");

        // 7. Study Plan — sessions for the current week
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const sessions = [
            { courseCode:"CSC111",  dayOfWeek:"Sunday",    startTime:"08:00", endTime:"10:30", duration:2.5, status:"done"    },
            { courseCode:"ENG305",  dayOfWeek:"Sunday",    startTime:"11:00", endTime:"13:00", duration:2,   status:"done"    },
            { courseCode:"MATH203", dayOfWeek:"Monday",    startTime:"16:00", endTime:"18:00", duration:2,   status:"done"    },
            { courseCode:"SWE381",  dayOfWeek:"Monday",    startTime:"18:30", endTime:"20:00", duration:1.5, status:"missed"  },
            { courseCode:"CSC111",  dayOfWeek:"Tuesday",   startTime:"08:00", endTime:"10:00", duration:2,   status:"pending" },
            { courseCode:"ENG305",  dayOfWeek:"Tuesday",   startTime:"10:30", endTime:"12:00", duration:1.5, status:"pending" },
            { courseCode:"SWE381",  dayOfWeek:"Wednesday", startTime:"16:00", endTime:"18:00", duration:2,   status:"pending" },
            { courseCode:"MATH203", dayOfWeek:"Wednesday", startTime:"18:30", endTime:"20:00", duration:1.5, status:"pending" },
            { courseCode:"CSC111",  dayOfWeek:"Thursday",  startTime:"08:00", endTime:"10:30", duration:2.5, status:"pending" },
            { courseCode:"ENG305",  dayOfWeek:"Thursday",  startTime:"11:00", endTime:"13:00", duration:2,   status:"pending" },
        ];

        const sunDate = new Date(today);
        sunDate.setDate(today.getDate() - today.getDay());

        for (const s of sessions) {
            const dayIndex     = days.indexOf(s.dayOfWeek);
            const sessionDate  = new Date(sunDate);
            sessionDate.setDate(sunDate.getDate() + dayIndex);
            await add(uid, "studyPlan", {
                ...s,
                date: sessionDate.toISOString().split("T")[0]
            });
        }
        console.log("Study plan written.");

        // 8. Notification settings
        await setDoc(doc(db, "users", uid, "settings", "notifications"), {
            deadlineReminders: true,
            sessionReminders:  true,
            missedAlerts:      false,
            earlyMinutes:      60
        });
        console.log("Settings written.");

        console.log("✅ Reseed complete!");
        alert("✅ Reseed complete!\nFirestore is now populated.\nRemove the reseed script tag from index.html.");

    } catch (err) {
        console.error("Reseed failed:", err);
        alert("Reseed failed: " + err.message);
    }
}

reseed();