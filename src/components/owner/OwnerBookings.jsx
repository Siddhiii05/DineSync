import React from "react";
import { Calendar, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";
import "../../styles/OwnerBookings.css";

export default function OwnerBookings({
  bookings,
  setBookings,
  totalSeats,
}) {
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Update status failed"
      );
    }
  };

  return (
    <div className="owner-bookings">
      <div className="owner-bookings-header">
        <h3>Active Reservations</h3>

        <span className="owner-bookings-capacity">
          Total capacity: {totalSeats} seats
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="owner-bookings-empty">
          <Calendar size={32} className="owner-bookings-empty-icon" />

          <p>No booking records found.</p>
        </div>
      ) : (
        <div className="owner-bookings-list">
          {bookings.map((booking) => (
            <div className="owner-booking-card" key={booking._id}>
              <div className="owner-booking-details">
                <div className="owner-booking-title">
                  <h4>{booking.user?.name || "Guest"}</h4>

                  <span className="owner-booking-id">
                    {booking.bookingId}
                  </span>
                </div>

                <div className="owner-booking-info">
                  <span>
                    <Users size={12} />
                    {booking.guests} Guests
                  </span>

                  <span>
                    <Clock size={12} />
                    {booking.time} PM
                  </span>

                  <span>
                    <Calendar size={12} />
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : "Date unavailable"}
                  </span>
                </div>

                {booking.specialRequests && (
                  <p className="owner-booking-requests">
                    <strong>Requests:</strong>{" "}
                    {booking.specialRequests}
                  </p>
                )}
              </div>

              <div className="owner-booking-actions">
                <span
                  className={`owner-booking-status owner-booking-status-${booking.status}`}
                >
                  {booking.status}
                </span>

                {booking.status === "confirmed" && (
                  <div className="owner-booking-buttons">
                    <button
                      type="button"
                      className="owner-booking-complete"
                      onClick={() =>
                        handleUpdateBookingStatus(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      Complete
                    </button>

                    <button
                      type="button"
                      className="owner-booking-cancel"
                      onClick={() =>
                        handleUpdateBookingStatus(
                          booking._id,
                          "cancelled"
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}