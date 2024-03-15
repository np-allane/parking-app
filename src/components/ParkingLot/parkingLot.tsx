import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ParkingSpot from "../ParkingSpot/parkingSpot";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export type Booking = {
  userId: string;
  spotId: number;
  date: Timestamp;
};

const ParkingLotContainer = styled.div`
  display: grid;
  gap: 10px;
  background-size: cover;

  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

type ParkingLotProps = {
  bookings: Booking[];
  onNewBooking: (newBooking: Booking) => Promise<void>;
};

const ParkingLot: React.FC<ParkingLotProps> = ({ bookings, onNewBooking }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const parkingSpots = [
    "2.098",
    "2.099",
    ...Array.from(Array(8).keys()).map((i) => (i + 1).toString()),
  ];

  return (
    <ParkingLotContainer>
      {parkingSpots.map((spot, index) => {
        const spotNumber = parseFloat(spot);
        const spotBookings = bookings.filter(
          (booking) => booking.spotId === spotNumber
        );
        return (
          <ParkingSpot
            key={index}
            number={spotNumber}
            isCurrentDayBooked={spotBookings.length > 0}
            bookings={spotBookings}
            onNewBooking={onNewBooking}
          />
        );
      })}
    </ParkingLotContainer>
  );
};

export default ParkingLot;
