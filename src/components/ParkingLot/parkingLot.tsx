import React from "react";
import styled from "styled-components";
import ParkingSpot from "../ParkingSpot/parkingSpot";
import { Timestamp } from "firebase/firestore";

export type Booking = {
  userId: string;
  spotId: number;
  date: Timestamp;
};

const ParkingLotContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background-size: cover;
`;

type ParkingLotProps = {
  bookings: Booking[];
  onNewBooking: (newBooking: Booking) => Promise<void>;
};

const ParkingLot: React.FC<ParkingLotProps> = ({ bookings, onNewBooking }) => {
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
