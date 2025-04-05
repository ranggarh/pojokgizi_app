// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA8FydgH05X0d1orAHO0gQZ4Wr1GXcMdHM",
    authDomain: "nutriclick-app.firebaseapp.com",
    databaseURL: "https://nutriclick-app-default-rtdb.firebaseio.com",
    projectId: "nutriclick-app",
    storageBucket: "nutriclick-app.firebasestorage.app",
    messagingSenderId: "134148709320",
    appId: "1:134148709320:web:be9354b0a7b175304ffefd"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
  
export { db };

