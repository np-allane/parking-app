import React, { useEffect, useState } from "react";
import "../../input.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import styled from "styled-components";
import ParkingLot, { Booking } from "../ParkingLot/parkingLot";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Navbar from "../Navbar/Navbar";
import UserContext from "../UserContext/UserContext";
import { getDocs, collection, addDoc } from "@firebase/firestore";
import { auth, db } from "../../firebase";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewBooking = async (newBooking: Booking) => {
    await addDoc(collection(db, "bookings"), newBooking);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    const fetchBookings = async () => {
      const bookingData = await getDocs(collection(db, "bookings"));
      const fetchedBookings: Booking[] = bookingData.docs.map(
        (doc) => doc.data() as Booking
      );
      setBookings(fetchedBookings);
    };

    fetchBookings();

    return unsubscribe;
  }, [refreshKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Navbar />
        <AppContainer>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/parkinglot" /> : <Login />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Pass the bookings prop to ParkingLot */}
            <Route
              path="/parkinglot"
              element={
                user ? (
                  <ParkingLot
                    bookings={bookings}
                    onNewBooking={handleNewBooking}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </AppContainer>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
