import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels } = useQuery({
    queryKey: ["fetchMyBookings"],
    queryFn: apiClient.fetchMyBookings,
  });

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="border border-slate-300 rounded-lg p-5 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold">{hotel.name}</h2>
              <p className="text-sm text-gray-600">
                {hotel.city}, {hotel.country}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-bold">Check-in:</span>{" "}
                {new Date(hotel.bookings[0].checkIn).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Check-out:</span>{" "}
                {new Date(hotel.bookings[0].checkOut).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Total Cost:</span> ₹
                {hotel.bookings[0].totalCost}
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  hotel.bookings[0].status === "approved"
                    ? "bg-green-100 text-green-800"
                    : hotel.bookings[0].status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Status:{" "}
                {hotel.bookings[0].status.charAt(0).toUpperCase() +
                  hotel.bookings[0].status.slice(1)}
              </div>
              {hotel.bookings[0].status !== "pending" && (
                <p className="text-sm text-gray-500">
                  Updated:{" "}
                  {new Date(hotel.bookings[0].statusUpdatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
