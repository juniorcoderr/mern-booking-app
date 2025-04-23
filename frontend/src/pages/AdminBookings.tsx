import { useQuery, useMutation } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { BookingType } from "../../../backend/src/shared/types";

interface ExtendedBookingType extends BookingType {
  hotelName: string;
  hotelId: string;
}

const AdminBookings = () => {
  const { data: bookings, refetch } = useQuery({
    queryKey: ["fetchPendingBookings"],
    queryFn: apiClient.fetchPendingBookings,
  });

  const { mutate: updateBookingStatus, isPending } = useMutation({
    mutationFn: apiClient.updateBookingStatus,
    onSuccess: () => {
      refetch();
    },
  });

  const handleStatusUpdate = (
    bookingId: string,
    status: "approved" | "rejected"
  ) => {
    updateBookingStatus({ bookingId, status });
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Pending Bookings</h1>
      {bookings && bookings.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-600">
            No Pending Bookings
          </h2>
          <p className="text-gray-500 mt-2">
            There are currently no bookings waiting for approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {bookings?.map((booking: ExtendedBookingType) => (
            <div
              key={booking._id}
              className="border border-slate-300 rounded-lg p-5 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                  <p className="text-sm text-gray-600">
                    {booking.firstName} {booking.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{booking.email}</p>
                </div>
                <div>
                  <p>
                    <span className="font-bold">Check-in:</span>{" "}
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">Check-out:</span>{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-bold">Total Cost:</span> ₹
                    {booking.totalCost}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleStatusUpdate(booking._id, "approved")}
                  disabled={isPending}
                  className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking._id, "rejected")}
                  disabled={isPending}
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 disabled:bg-gray-500"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
