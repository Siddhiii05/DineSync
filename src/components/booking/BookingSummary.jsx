import { Calendar, Users, Clock, MapPin } from "lucide-react";
import "../../styles/BookingSummary.css";

export default function BookingSummary({
    restaurant,
    date,
    slot,
    guests,
}) {
    if (!restaurant) return null;

    return (
        <div className="booking-summary-card">
            <h3 className="booking-summary-title">
                Reservation Summary
            </h3>

            {/* Restaurant Information */}
            <div className="booking-summary-restaurant">
                <div className="booking-summary-image-container">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="booking-summary-image"
                    />
                </div>

                <div className="booking-summary-restaurant-info">
                    <span className="booking-summary-cuisine">
                        {restaurant.cuisine}
                    </span>

                    <h4 className="booking-summary-restaurant-name">
                        {restaurant.name}
                    </h4>

                    <p className="booking-summary-location">
                        <MapPin size={12} />
                        <span>{restaurant.location}</span>
                    </p>
                </div>
            </div>

            {/* Date, Time, and Guests */}
            <div className="booking-summary-details">
                <div className="booking-summary-detail-row">
                    <span className="booking-summary-label">
                        <Calendar size={14} />
                        Date
                    </span>

                    <span className="booking-summary-value">
                        {date
                            ? new Date(date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : "Not selected"}
                    </span>
                </div>

                <div className="booking-summary-detail-row">
                    <span className="booking-summary-label">
                        <Clock size={14} />
                        Time
                    </span>

                    <span className="booking-summary-value">
                        {slot ? `${slot} PM` : "Not selected"}
                    </span>
                </div>

                <div className="booking-summary-detail-row">
                    <span className="booking-summary-label">
                        <Users size={14} />
                        Party Size
                    </span>

                    <span className="booking-summary-value">
                        {guests} Guests
                    </span>
                </div>
            </div>

            {/* Cancellation Policy */}
            <div className="booking-summary-policy">
                <h5 className="booking-summary-policy-title">
                    Cancellation Policy
                </h5>

                <p className="booking-summary-policy-text">
                    We hold reservations for a maximum of 15 minutes.
                    Cancellations or changes can be made free of charge
                    up to 24 hours in advance.
                </p>
            </div>
        </div>
    );
}