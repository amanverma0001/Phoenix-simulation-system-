/**
 * Firebase Configuration - Simulator Project
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBggi5SIfJaLsx-M5hLTRO97Z71ZldXkAE",
    authDomain: "simulator-f2bac.firebaseapp.com",
    databaseURL: "https://simulator-f2bac-default-rtdb.firebaseio.com",
    projectId: "simulator-f2bac",
    storageBucket: "simulator-f2bac.firebasestorage.app",
    messagingSenderId: "83072250237",
    appId: "1:83072250237:web:e879e8d71d2e946a605c14",
    measurementId: "G-R6EVFVGGNJ"
};

// Initialize Firebase (singleton pattern for Next.js)
let app: FirebaseApp;
let database: Database;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

database = getDatabase(app);

export { app, database };
export default database;
