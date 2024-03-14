import React, { useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { Booking } from "../ParkingLot/parkingLot";
import { ParkingSpotContainer, Number } from "../../styles/ParkingSpotStyles";
import "react-datepicker/dist/react-datepicker.css";
import { auth } from "../../firebase";

type ParkingSpotProps = {
  number: number;
  isCurrentDayBooked: boolean;
  bookings: Booking[];
  onNewBooking: (newBooking: Booking) => Promise<void>;
  className?: string;
};

const ParkingSpot: React.FC<ParkingSpotProps> = ({
  number,
  bookings = [],
  onNewBooking,
}) => {
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay.toLocaleDateString("en-US", { weekday: "short" }));
    }
    return days;
  }, []);

  const handleBookSpot = async (dayIndex: number) => {
    const today = new Date();
    const dateToBook = new Date(today);
    dateToBook.setDate(today.getDate() + dayIndex);

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    if (dateToBook > oneWeekFromNow) {
      alert("Cannot book more than a week in advance");
      return;
    }

    const isBooked = bookings.some((booking) => {
      const bookingDate = booking.date.toDate();
      return (
        bookingDate.getDate() === dateToBook.getDate() &&
        booking.spotId === number
      );
    });

    if (!isBooked) {
      const newBooking = {
        userId: auth.currentUser?.email || "",
        spotId: number,
        date: Timestamp.fromDate(dateToBook),
      };
      await onNewBooking(newBooking);
    } else {
      alert("The selected day is already booked");
    }
  };

  const getBookingForDay = (dayIndex: number) => {
    const today = new Date();
    const dateToCheck = new Date(today);
    dateToCheck.setDate(today.getDate() + dayIndex);

    const foundBooking = bookings.find((booking) => {
      const bookingDate = booking.date.toDate();
      return (
        bookingDate.getDate() === dateToCheck.getDate() &&
        bookingDate.getMonth() === dateToCheck.getMonth() &&
        bookingDate.getFullYear() === dateToCheck.getFullYear() &&
        booking.spotId === number
      );
    });

    if (foundBooking) {
      return (
        <span className="text-sm md:text-md lg:text-lg text-white truncate max-w-[calc(100%-1.5rem)]">
          @{foundBooking.userId.split("@")[0]}
        </span>
      );
    } else {
      return (
        <button
          className="text-sm md:text-md lg:text-lg text-white bg-green-500 py-2 px-4 rounded"
          onClick={() => handleBookSpot(dayIndex)}
        >
          FREE TO BOOK
        </button>
      );
    }
  };

  return (
    <ParkingSpotContainer className="w-[150px] h-[250px] m-2 relative bg-blue-500 flex flex-col justify-between p-3">
      <Number className="text-lg self-end text-white">{number}</Number>
      <div className="absolute bottom-2 left-0 flex flex-col items-start space-y-1">
        {weekDays.map((day, index) => (
          <div key={index} className="flex items-center">
            <span className="bg-white text-gray-800 text-base lg:text-lg font-bold py-1 pl-1 pr-2 rounded-r-full min-w-[50px] h-6 flex items-center justify-start">
              {day}
            </span>
            <div className="relative flex-grow">
              {getBookingForDay(index)}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            </div>
          </div>
        ))}
      </div>
    </ParkingSpotContainer>
  );
};

export default ParkingSpot;
