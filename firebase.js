import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_dQgUJv1ZNYwcQU6R4--zKu9DClbHA7I",
  authDomain: "airbnb-ac4fa.firebaseapp.com",
  projectId: "airbnb-ac4fa",
  storageBucket: "airbnb-ac4fa.appspot.com",
  messagingSenderId: "757827080515",
  appId: "1:757827080515:web:8d9e1f02c51ae386da5ff6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default db;
