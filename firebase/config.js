import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXzpr1w-PzfuCpwQUn0sDBWHi2kGyPnqE",
  authDomain: "wellmarktechnologies-e8d72.firebaseapp.com",
  databaseURL:
    "https://wellmarktechnologies-e8d72-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wellmarktechnologies-e8d72",
  storageBucket: "wellmarktechnologies-e8d72.appspot.com",
  messagingSenderId: "412011432367",
  appId: "1:412011432367:web:b77a92aafef3ff6050075a",
  measurementId: "G-0EVDCFKTYP",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const auth = getAuth(app);

export { db, storage, auth };
