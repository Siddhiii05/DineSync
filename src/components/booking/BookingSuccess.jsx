import { Link } from "react-router-dom";
import {
    Calendar,
    Users,
    Clock,
    MapPin,
    Check,
} from "lucide-react";

import "../../styles/BookingSuccess.css";

export default function BookingSuccess({
    confirmedBooking,
    restaurant,
    date,
    slot,
    guests,
}) {
    if (!confirmedBooking || !restaurant) return null;

    return (
        <div className="booking-success-card">
            <div className="booking-success-icon">
                <Check size={32} />
            </div>

            <div className="booking-success-heading">
                <h2 className="booking-success-title">
                    Reservation Confirmed
                </h2>

                <p className="booking-success-description">
                    A curated dining experience has been successfully reserved for you at{" "}
                    <span className="booking-success-restaurant-name">
                        {restaurant.name}
                    </span>.
                </p>
            </div>

            {/* Confirmation Card Details */}
            <div className="booking-confirmation-details">
                <div className="booking-reference-row">
                    <span className="booking-reference-label">
                        REFERENCE CODE
                    </span>

                    <span className="booking-reference-value">
                        {confirmedBooking.bookingId}
                    </span>
                </div>

                <div className="booking-details-list">
                    <div className="booking-detail-item">
                        <Calendar
                            size={14}
                            className="booking-detail-icon"
                        />

                        <span>
                            {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="booking-detail-item">
                        <Clock
                            size={14}
                            className="booking-detail-icon"
                        />

                        <span>{slot} PM</span>
                    </div>

                    <div className="booking-detail-item">
                        <Users
                            size={14}
                            className="booking-detail-icon"
                        />

                        <span>{guests} Guests</span>
                    </div>

                    <div className="booking-detail-item booking-address-item">
                        <MapPin
                            size={14}
                            className="booking-detail-icon"
                        />

                        <span>{restaurant.address}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="booking-success-actions">
                <Link
                    to="/dashboard"
                    className="booking-success-button booking-my-bookings"
                >
                    MY BOOKINGS
                </Link>

                <Link
                    to="/"
                    className="booking-success-button booking-discover-more"
                >
                    DISCOVER MORE
                </Link>
            </div>
        </div>
    );
}