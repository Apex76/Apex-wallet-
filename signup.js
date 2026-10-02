import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

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

  apiKey:
  "AIzaSyDqpSzFzHDS-zI1gR6oP-wXWqKBfXgcX4w",

  authDomain:
  "apex-wallet-2.firebaseapp.com",

  projectId:
  "apex-wallet-2",

  storageBucket:
  "apex-wallet-2.firebasestorage.app",

  messagingSenderId:
  "660772557652",

  appId:
  "1:660772557652:web:b9535515388134f8802ec1",

  measurementId:
  "G-KEJP4GN5VV"

};


const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);


const signupForm =
document.getElementById("signupForm");

const signupBtn =
document.getElementById("signupBtn");

const message =
document.getElementById("message");


/*
================================
COMPRESS PROFILE PICTURE
================================
*/

function compressImage(file){

  return new Promise((resolve,reject)=>{

    const reader =
    new FileReader();

    reader.onload = function(event){

      const image =
      new Image();

      image.onload = function(){

        const canvas =
        document.createElement("canvas");

        const maxSize = 400;

        let width =
        image.width;

        let height =
        image.height;


        if(width > height){

          if(width > maxSize){

            height =
            height * maxSize / width;

            width =
            maxSize;

          }

        }else{

          if(height > maxSize){

            width =
            width * maxSize / height;

            height =
            maxSize;

          }

        }


        canvas.width =
        width;

        canvas.height =
        height;


        const ctx =
        canvas.getContext("2d");

        ctx.drawImage(
          image,
          0,
          0,
          width,
          height
        );


        const compressed =
        canvas.toDataURL(
          "image/jpeg",
          0.7
        );


        resolve(compressed);

      };


      image.onerror =
      reject;

      image.src =
      event.target.result;

    };


    reader.onerror =
    reject;

    reader.readAsDataURL(file);

  });

}


/*
================================
CREATE ACCOUNT
================================
*/

signupForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


    const fullname =
    document
    .getElementById("fullname")
    .value
    .trim();


    const email =
    document
    .getElementById("email")
    .value
    .trim();


    const password =
    document
    .getElementById("password")
    .value;


    const confirmPassword =
    document
    .getElementById("confirmPassword")
    .value;


    const profileFile =
    document
    .getElementById("profileImage")
    .files[0];


    message.textContent = "";
    message.style.color = "red";


    /*
    CHECK PASSWORD
    */

    if(password !== confirmPassword){

      message.textContent =
      "Passwords do not match.";

      return;

    }


    /*
    CHECK PICTURE
    */

    if(!profileFile){

      message.textContent =
      "Please upload a profile picture.";

      return;

    }


    /*
    CHECK IMAGE TYPE
    */

    if(!profileFile.type.startsWith("image/")){

      message.textContent =
      "Please select a valid image.";

      return;

    }


    /*
    BUTTON
    */

    signupBtn.disabled =
    true;

    signupBtn.textContent =
    "CREATING ACCOUNT...";


    try{


      /*
      COMPRESS PICTURE
      */

      const profileImage =
      await compressImage(profileFile);


      /*
      CREATE FIREBASE ACCOUNT
      */

      const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


      const user =
      userCredential.user;


      /*
      SAVE NAME TO FIREBASE AUTH
      */

      await updateProfile(
        user,
        {
          displayName: fullname
        }
      );


      /*
      SAVE USER INFORMATION
      */

      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {

          fullname:
          fullname,

          email:
          email,

          balance:
          0,

          profileImage:
          profileImage

        }
      );


      /*
      SAVE NAME LOCALLY
      */

      localStorage.setItem(
        "fullname",
        fullname
      );


      /*
      SUCCESS
      */

      message.style.color =
      "green";

      message.textContent =
      "Account created successfully!";


      /*
      GO TO LOGIN
      */

      setTimeout(() => {

        window.location.href =
        "index.html";

      }, 1200);


    }catch(error){

      console.error(error);


      message.style.color =
      "red";


      if(
        error.code ===
        "auth/email-already-in-use"
      ){

        message.textContent =
        "This email already has an account.";

      }else if(
        error.code ===
        "auth/weak-password"
      ){

        message.textContent =
        "Password is too weak.";

      }else{

        message.textContent =
        error.message;

      }


    }finally{

      signupBtn.disabled =
      false;

      signupBtn.textContent =
      "CREATE ACCOUNT";

    }

  }
);
