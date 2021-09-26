import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDLfb4_CZjcWWcAGOne1op0J_W5O9YbgYs",
  authDomain: "vuefirebaseblog-a10bf.firebaseapp.com",
  projectId: "vuefirebaseblog-a10bf",
  storageBucket: "vuefirebaseblog-a10bf.appspot.com",
  messagingSenderId: "427151113936",
  appId: "1:427151113936:web:8e330a8dd69020b70128d5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();