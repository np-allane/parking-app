import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  DocumentReference,
  writeBatch,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAGdBdmCKgZh3jhRpFDfTvV9m6c2bXU88",
  authDomain: "parking-app-7ff09.firebaseapp.com",
  projectId: "parking-app-7ff09",
  storageBucket: "parking-app-7ff09.appspot.com",
  messagingSenderId: "29874754607",
  appId: "1:29874754607:web:3624f13cd6ac374be5a2da",
  measurementId: "G-7FR8N39DQ4",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const deleteExpiredBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("date", "<", Timestamp.fromDate(twoDaysAgo))
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref as DocumentReference);
      });

      await batch.commit();
      console.log(`${querySnapshot.size} bookings older than two days deleted`);
    } else {
      console.log("No bookings to delete");
    }
  } catch (error) {
    console.error("Error deleting expired bookings:", error);
  }
};

deleteExpiredBookings();
