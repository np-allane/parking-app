import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import UserContext from "../UserContext/UserContext";

type NavigationBarProps = {
  showMessages: boolean;
  onToggleMessages: () => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  showMessages,
  onToggleMessages,
}) => {
  const user = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-gray-800 p-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-semibold no-underline">
          Anthill Parking Lot
        </Link>
        <button
          onClick={onToggleMessages}
          className="text-white text-sm px-4 py-2 border rounded border-white hover:border-transparent hover:text-blue-500 hover:bg-white"
        >
          {showMessages ? "Boring" : "Sassy"}
        </button>
        <div className="flex items-center">
          {user && (
            <>
              <span className="text-white text-sm mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-white text-sm px-4 py-2 border rounded border-white hover:border-transparent hover:text-blue-500 hover:bg-white"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="text-white text-sm px-4 py-2 border rounded border-white hover:border-transparent hover:text-blue-500 hover:bg-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
