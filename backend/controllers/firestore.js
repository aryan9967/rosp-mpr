// import { collection, query, where } from 'firebase/firestore';
import admin from "firebase-admin";
import dotenv from "dotenv";

//configure env
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db, admin };



