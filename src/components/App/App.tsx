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
import messages from "../../data/messages.json";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const TypingText = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Consolas", "Courier New", monospace;
  font-size: 20px;
  white-space: pre;
  overflow: hidden;
  border-right: 3px solid;
  animation: blinkCursor 0.75s step-end infinite;

  @keyframes blinkCursor {
    from {
      border-right-color: transparent;
    }
    to {
      border-right-color: black;
    }
  }
`;

const generateRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMessages, setShowMessages] = useState(true);

  const toggleMessages = () => {
    setShowMessages((prevShow) => !prevShow);
  };

  const handleNewBooking = async (newBooking: Booking) => {
    await addDoc(collection(db, "bookings"), newBooking);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let currentMessage = generateRandomMessage();
    let currentIndex = 0;

    const typeLetter = () => {
      if (currentIndex < currentMessage.length) {
        setTypedMessage((prev) => prev + currentMessage[currentIndex]);
        currentIndex++;
        const randomDelay = Math.random() * (120 - 50) + 50;
        setTimeout(typeLetter, randomDelay);
      }
    };

    typeLetter();

    return () => {
      setTypedMessage("");
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const bookingData = await getDocs(collection(db, "bookings"));
          const fetchedBookings: Booking[] = bookingData.docs.map(
            (doc) => doc.data() as Booking
          );
          setBookings(fetchedBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshKey]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Navbar showMessages={showMessages} onToggleMessages={toggleMessages} />
        {showMessages && <TypingText>{typedMessage}</TypingText>}
        <AppContainer>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/parkinglot" /> : <Login />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
