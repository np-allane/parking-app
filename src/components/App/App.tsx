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
  const messages = [
    "Това е мястото на шефа!",
    "Не се научи да ползваш градския транспорт!",
    "А да отслабнем, кога?",
    "Пак ти ли? Паркингът е вторият ти дом!",
    "Изненада! Твоето място те чакаше.",
    "Колко пъти ще дойдеш? Има и други места!",
    "Ех, ако колата можеше да си намери сама място...",
    "И ти в паркинга? Мястото за VIP ли искаш?",
    "Поздравления! Откри тайното място.",
    "Спряхме времето, докато паркираш.",
    "Твоето място те обича - винаги се връщаш!",
    "Елате пак! Паркингът ни има нужда от теб.",
    "И този ден да мине без драскотини.",
    "Пак на това място? Може би трябва да го купиш!",
    "Твоята кола вече мисли, че това е нейният дом.",
    "Спряхме времето, докато паркираш.",
    "Толкова бързо се върна, че мястото още те помни!",
    "О, изненада, ти пак ли?",
    "Е, да! Това място е по-популярно от звездите в Instagram.",
    "Хей, не забравяй, че колелата трябва да сочат напред!",
    "Супергерой в паркирането, а?",
    "Надяваме се някой ден да се научиш да паркираш по-бързо!",
    "Ако паркирането беше спорт, ти сигурно щеше да си олимпийски шампион.",
    "Колата ти вече иска да си тръгне оттук!",
    "Ти си тук по-често, отколкото си у дома!",
    "Мястото каза, че ти липсва.",
    "Паркингът се чувства като твой личен гараж, нали?",
    "Ако паркирането беше изкуство, ти щеше да си Пикасо.",
    "Твоето паркиране ни вдъхновява всеки ден!",
    "Паркираш така, сякаш колата ти е с автопилот.",
    "Какво ще кажеш за паркинг сезонен абонамент?",
    "Ето те пак! Мястото вече ти се радва.",
    "Ти ли ни спаси от самотата, шофьор-герой?",
    "Тази кола вече знае пътя към паркинга по-добре от теб.",
    "Още едно паркиране за историята.",
  ];
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
        const randomDelay = Math.random() * (120 - 50) + 50; // Adjust range as needed
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
          // Handle the error appropriately, perhaps by setting an error state
        }
      } else {
        setUser(null); // Ensure user is set to null if not logged in
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
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
