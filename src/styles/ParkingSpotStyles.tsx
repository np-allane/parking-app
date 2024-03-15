import React from "react";

type ParkingSpotContainerProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const ParkingSpotContainer: React.FC<ParkingSpotContainerProps> = ({
  children,
  onClick,
  className,
}) => {
  const getWidth = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      return "100px";
    } else if (screenWidth < 768) {
      return "200px";
    } else {
      return "300px";
    }
  };

  const getHeight = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      return "200px";
    } else if (screenWidth < 768) {
      return "300px";
    } else {
      return "400px";
    }
  };

  const inlineStyle = {
    minWidth: getWidth(),
    minHeight: getHeight(),
    border: "1px solid black",
  };

  return (
    <div
      className={`border border-black bg-gray-800 ${className}`}
      onClick={onClick}
      style={inlineStyle}
    >
      {children}
    </div>
  );
};

type NumberProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Number: React.FC<NumberProps> = ({ children, className }) => {
  return <span className={`text-2xl ${className}`}>{children}</span>;
};
