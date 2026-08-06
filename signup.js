import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvC9ED0-sEEziluox2oG9FZdlbyIttPzU",
  authDomain: "apex-bank-6745c.firebaseapp.com",
  projectId: "apex-bank-6745c",
  storageBucket: "apex-bank-6745c.appspot.com",
  messagingSenderId: "152191975529",
  appId: "1:152191975529:web:959ef05137a60e9ccda2f8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      return updateProfile(userCredential.user, {
        displayName: fullname
      });

    })
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
