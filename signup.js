import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqpSzFzHDS-zI1gR6oP-wXWqKBfXgcX4w",
  authDomain: "apex-wallet-2.firebaseapp.com",
  projectId: "apex-wallet-2",
  storageBucket: "apex-wallet-2.firebasestorage.app",
  messagingSenderId: "660772557652",
  appId: "1:660772557652:web:b9535515388134f8802ec1",
  measurementId: "G-KEJP4GN5VV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: fullname
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      fullname: fullname,
      email: email,
      balance: 0
    });

    localStorage.setItem("fullname", fullname);

    alert("Account created successfully!");
    window.location.href = "index.html";

  } catch (error) {
    alert(error.message);
  }
});
