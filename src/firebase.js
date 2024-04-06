import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC7iKUASBc_IV0rP3wJ4H2__Umw54PLwFA",
  authDomain: "chatapp-ffcb6.firebaseapp.com",
  projectId: "chatapp-ffcb6",
  storageBucket: "chatapp-ffcb6.appspot.com",
  messagingSenderId: "629138591623",
  appId: "1:629138591623:web:d717946526e93b29810d22"
};

export const app = initializeApp(firebaseConfig);