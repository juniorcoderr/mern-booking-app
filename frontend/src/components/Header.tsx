import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import Notification from "./Notification";

const Header = () => {
  const { isLoggedIn } = useAppContext();

  const { data: currentUser } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: apiClient.fetchCurrentUser,
    enabled: isLoggedIn,
  });

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
              {currentUser?.role === "customer" && (
                <>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                  <Notification />
                </>
              )}
              {currentUser?.role === "admin" && (
                <>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/add-hotel"
                  >
                    Add Hotels
                  </Link>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/my-hotels"
                  >
                    My Hotels
                  </Link>
                  <Link
                    className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                    to="/admin/bookings"
                  >
                    Admin Dashboard
                  </Link>
                </>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
