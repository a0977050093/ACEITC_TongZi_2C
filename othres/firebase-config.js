// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv-DYm4c4l9Dn-o7ME4TnI92YsCpss1nM",
  authDomain: "carsign-423fc.firebaseapp.com",
  databaseURL: "https://carsign-423fc-default-rtdb.firebaseio.com",
  projectId: "carsign-423fc",
  storageBucket: "carsign-423fc.firebasestorage.app",
  messagingSenderId: "219688439999",
  appId: "1:219688439999:web:2d4f8646c98bcb76e4360a",
  measurementId: "G-7FRW6JPXBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
