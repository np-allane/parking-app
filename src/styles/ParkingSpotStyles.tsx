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
  const inlineStyle = { minWidth: "300px", minHeight: "400px" };

  return (
    <div
      className={`border border-black  bg-gray-800 ${className}`}
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
