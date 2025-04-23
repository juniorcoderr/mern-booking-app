import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../middleware/auth";
import Hotel from "../models/hotel";
import { BookingType } from "../shared/types";
import nodemailer from "nodemailer";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  next();
};

// Get all pending bookings for hotels owned by the admin
router.get(
  "/bookings/pending",
  verifyToken,
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const hotels = await Hotel.find({ userId: req.userId });
      const pendingBookings: (BookingType & {
        hotelName: string;
        hotelId: string;
      })[] = [];

      hotels.forEach((hotel) => {
        hotel.bookings.forEach((booking) => {
          if (booking.status === "pending") {
            const bookingObj = (booking as any).toJSON();
            pendingBookings.push({
              ...bookingObj,
              hotelName: hotel.name,
              hotelId: hotel._id.toString(),
            });
          }
        });
      });

      res.status(200).json(pendingBookings);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching pending bookings" });
    }
  }
);

// Update booking status
router.put(
  "/bookings/:bookingId",
  verifyToken,
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      const hotel = await Hotel.findOne({
        "bookings._id": bookingId,
        userId: req.userId,
      });

      if (!hotel) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      const bookingIndex = hotel.bookings.findIndex(
        (b) => b._id.toString() === bookingId
      );
      if (bookingIndex === -1) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }

      hotel.bookings[bookingIndex].status = status;
      hotel.bookings[bookingIndex].statusUpdatedAt = new Date();
      await hotel.save();

      // Send email notification
      await sendBookingStatusEmail(
        hotel.bookings[bookingIndex],
        status,
        hotel.name
      );

      res.status(200).json({ message: "Booking status updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating booking status" });
    }
  }
);

// Email notification function
async function sendBookingStatusEmail(
  booking: BookingType,
  status: string,
  hotelName: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = `Your booking at ${hotelName} has been ${status}`;
  const text =
    `Dear ${booking.firstName} ${booking.lastName},\n\n` +
    `Your booking at ${hotelName} has been ${status}.\n` +
    `Check-in: ${booking.checkIn}\n` +
    `Check-out: ${booking.checkOut}\n` +
    `Total cost: ${booking.totalCost}\n\n` +
    `Thank you for choosing our service.`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    subject,
    text,
  });
}

export default router;
