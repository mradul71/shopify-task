const { initializeApp } = require("firebase/app");
const {getFirestore} = require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyA0xfSm0o8w1kKxOgaTHWhMuDiRJkMJ760",
  authDomain: "shopify-task.firebaseapp.com",
  projectId: "shopify-task",
  storageBucket: "shopify-task.appspot.com",
  messagingSenderId: "689854120984",
  appId: "1:689854120984:web:397cd31d25f3796eb2ef6d",
  measurementId: "G-LSSMEHEKLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = {db};