import React from "react";
import { Calendar, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";
import "../../styles/OwnerBookings.css";

export default function OwnerBookings({
  bookings = [],
  setBookings,
  totalSeats = 0,
}) {
  // Ensure bookings is an array.
  const safeBookings = Array.isArray(bookings)
    ? bookings
    : Array.isArray(bookings?.bookings)
      ? bookings.bookings
      : [];

  // Update the booking status in the backend and frontend.
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/owner/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      if (typeof setBookings === "function") {
        setBookings((previousBookings) => {
          if (Array.isArray(previousBookings)) {
            return previousBookings.map((booking) =>
              booking._id === bookingId
                ? { ...booking, status: newStatus }
                : booking
            );
          }

          if (Array.isArray(previousBookings?.bookings)) {
            return {
              ...previousBookings,
              bookings: previousBookings.bookings.map((booking) =>
                booking._id === bookingId
                  ? { ...booking, status: newStatus }
                  : booking
              ),
            };
          }

          return previousBookings;
        });
      }

      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error(
        "Failed to update booking status:",
        error.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update booking status"
      );
    }
  };

  // CSS class for the selected status.
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "confirmed";

      case "completed":
        return "completed";

      case "cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  // Determine whether the booking has a final status.
  const isPending = (status) =>
    !status ||
    ["pending", "undefined", "null", ""].includes(
      String(status).toLowerCase()
    );

  return (
    <div className="owner-bookings">
      {/* Section heading */}
      <div className="owner-bookings-header">
        <h2>Active Reservations</h2>

        <p>
          Total capacity: <strong>{totalSeats}</strong> seats
        </p>
      </div>

      {/* Empty state */}
      {safeBookings.length === 0 ? (
        <div className="no-bookings">
          <Calendar size={40} />

          <h3>No bookings yet</h3>

          <p>
            Customer reservations for your restaurant will appear here.
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {safeBookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              {/* Customer information */}
              <div className="booking-card-header">
                <div>
                  <h3>{booking.user?.name || "Guest"}</h3>

                  {booking.bookingId && (
                    <p className="booking-id">
                      {booking.bookingId}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking details */}
              <div className="booking-details">
                <div className="booking-detail">
                  <Users size={14} />

                  <span>
                    {booking.guests ?? 0}{" "}
                    {(booking.guests ?? 0) === 1
                      ? "Guest"
                      : "Guests"}
                  </span>
                </div>

                <div className="booking-detail">
                  <Clock size={14} />

                  <span>
                    {booking.time || "Time unavailable"}
                  </span>
                </div>

                <div className="booking-detail">
                  <Calendar size={14} />

                  <span>
                    {booking.date
                      ? new Date(
                          booking.date
                        ).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Date unavailable"}
                  </span>
                </div>
              </div>

              {/* Optional booking information */}
              {booking.occasion && (
                <p className="booking-occasion">
                  <strong>Occasion:</strong> {booking.occasion}
                </p>
              )}

              {booking.specialRequests && (
                <p className="booking-requests">
                  <strong>Special requests:</strong>{" "}
                  {booking.specialRequests}
                </p>
              )}

              {/* Booking status and actions */}
              <div className="booking-actions">
                {isPending(booking.status) ? (
                  <>
                    <button
                      type="button"
                      className="confirm-booking-btn"
                      onClick={() =>
                        handleUpdateBookingStatus(
                          booking._id,
                          "confirmed"
                        )
                      }
                    >
                      CONFIRM
                    </button>

                    <button
                      type="button"
                      className="complete-booking-btn"
                      onClick={() =>
                        handleUpdateBookingStatus(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      COMPLETE
                    </button>

                    <button
                      type="button"
                      className="cancel-booking-btn"
                      onClick={() =>
                        handleUpdateBookingStatus(
                          booking._id,
                          "cancelled"
                        )
                      }
                    >
                      CANCEL
                    </button>
                  </>
                ) : (
                  <span
                    className={`booking-status ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {String(booking.status).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restaurant capacity */}
      {totalSeats > 0 && (
        <p className="owner-total-seats">
          Total restaurant seats: {totalSeats}
        </p>
      )}
    </div>
  );
}
