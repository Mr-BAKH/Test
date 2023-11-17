// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOi2d7Q0AjPQlH_jzfxI2DJ6IxUh2gTI0",
  authDomain: "chatapplication-95f1c.firebaseapp.com",
  projectId: "chatapplication-95f1c",
  storageBucket: "chatapplication-95f1c.appspot.com",
  messagingSenderId: "658381909007",
  appId: "1:658381909007:web:e657df36653bc15281477a"
};

// Initialize Firebase
export const Firebase_App = initializeApp(firebaseConfig);
export const Firebase_Auth = getAuth(Firebase_App);


