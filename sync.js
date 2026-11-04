// Синхронізація між пристроями через Firebase (вхід через Google).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC6YyDM1eSC-i509MmTLl78ongN-E2-QtQ",
  authDomain: "miy-prostir.firebaseapp.com",
  projectId: "miy-prostir",
  storageBucket: "miy-prostir.firebasestorage.app",
  messagingSenderId: "645466745772",
  appId: "1:645466745772:web:027260c370348b52b96809"
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);
const OLD_DOC = doc(db, "users", "miy-prostir-user", "data", "main");

let user = null, unsub = null, pushTimer = null, lastPushedTs = 0;
const docRef = () => user ? doc(db, "users", user.uid, "data", "state") : doc(db, "users", "miy-prostir-user", "data", "v2");

function status(text, kind) { window.App && window.App.setSync(text, kind, user); }

async function attach() {
  if (unsub) { unsub(); unsub = null; }
  if (!user) { status("Не увійшла", "warn"); return; }
  const ref = docRef();
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      window.App.onRemote(snap.data(), true);
      window.App.markSynced();
    } else {
      // Новий документ: спершу пробуємо підтягнути дані зі старої версії додатку
      if (window.App.needsMigration()) {
        try {
          const old = await getDoc(OLD_DOC);
          if (old.exists()) window.App.migrateFromCloud(old.data());
        } catch (e) { console.warn("old doc", e); }
      }
      await pushNow();
    }
    unsub = onSnapshot(ref, s => {
      if (!s.exists()) return;
      const d = s.data();
      if (d._ts && d._ts !== lastPushedTs) window.App.onRemote(d);
    }, e => { console.warn(e); status("Лише на цьому пристрої", "warn"); });
    status(user ? "Синхронізовано" : "Синхронізовано (без входу)", "ok");
  } catch (e) {
    console.warn("sync", e);
    status(user ? "Немає доступу до бази" : "Лише на цьому пристрої", "warn");
  }
}

async function pushNow() {
  const payload = window.App.exportForSync();
  lastPushedTs = payload._ts;
  try {
    await setDoc(docRef(), payload);
    window.App.markSynced();
    status("Збережено", "ok");
  } catch (e) {
    console.warn("push", e);
    status("Не збереглося в хмару", "warn");
  }
}

window.Sync = {
  push() { if (!user) return; clearTimeout(pushTimer); status("Зберігаю…", "busy"); pushTimer = setTimeout(pushNow, 700); },
  async signIn() {
    const p = new GoogleAuthProvider();
    try { await signInWithPopup(auth, p); }
    catch (e) {
      if (String(e.code).includes("popup")) await signInWithRedirect(auth, p);
      else { console.warn(e); window.App.toast("Не вдалося увійти: " + (e.code || e.message)); }
    }
  },
  async signOut() { await signOut(auth); },
};

getRedirectResult(auth).catch(() => {});
onAuthStateChanged(auth, u => { user = u; attach(); });
