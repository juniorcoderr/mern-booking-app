import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { BookingType } from "../../../backend/src/shared/types";
import { useAppContext } from "../contexts/AppContext";

const Notification = () => {
  const [notifications, setNotifications] = useState<BookingType[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<
    string[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isLoggedIn } = useAppContext();

  // Load dismissed notifications from localStorage on component mount
  useEffect(() => {
    const storedDismissed = localStorage.getItem("dismissedNotifications");
    if (storedDismissed) {
      setDismissedNotifications(JSON.parse(storedDismissed));
    }
  }, []);

  const { data: bookings } = useQuery({
    queryKey: ["fetchMyBookings"],
    queryFn: apiClient.fetchMyBookings,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (bookings) {
      const newNotifications = bookings.flatMap((hotel) =>
        hotel.bookings.filter(
          (booking) =>
            booking.status !== "pending" &&
            new Date(booking.statusUpdatedAt).getTime() >
              Date.now() - 24 * 60 * 60 * 1000 &&
            !dismissedNotifications.includes(booking._id)
        )
      );
      setNotifications(newNotifications);
    }
  }, [bookings, dismissedNotifications]);

  const handleDismiss = (notificationId: string) => {
    const newDismissed = [...dismissedNotifications, notificationId];
    setDismissedNotifications(newDismissed);
    // Store dismissed notifications in localStorage
    localStorage.setItem(
      "dismissedNotifications",
      JSON.stringify(newDismissed)
    );
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:bg-blue-600 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-600 text-center">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-2 text-sm ${
                    notification.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        Booking{" "}
                        {notification.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                      </p>
                      <p className="text-xs">
                        {new Date(
                          notification.statusUpdatedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(notification._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
