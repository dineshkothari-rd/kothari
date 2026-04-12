import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqJycrKpeIxEmZUkUCjO6PN8RZb9GoLhM",
  authDomain: "kothari-pg.firebaseapp.com",
  projectId: "kothari-pg",
  storageBucket: "kothari-pg.firebasestorage.app",
  messagingSenderId: "481768124087",
  appId: "1:481768124087:web:49df4bb5ac5905540fa732",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
