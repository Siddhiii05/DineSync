import { Link, useNavigate } from "react-router-dom";
import { Star, MapPinIcon } from "lucide-react";
import { dummyRating } from "../assets/assets.js";

import "../styles/RestaurantCard.css";

export default function RestaurantCard({ restaurant }) {
    const navigate = useNavigate();

    const handleSlotClick = (e, slot) => {
        e.preventDefault();
        e.stopPropagation();

        const today = new Date().toISOString().split("T")[0];

        // Navigate to the booking page with the selected slot and date
        navigate(`/booking/${restaurant.slug}?slot=${encodeURIComponent(slot)}&date=${today}`);
    };

    return (
        <div className="restaurant-card">
            {/* Image and Badges */}
            <Link
                to={`/restaurant/${restaurant.slug}`}
                className="restaurant-image-link"
            >
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="restaurant-image"
                    loading="lazy"
                />

                <div className="restaurant-image-overlay"></div>

                {/* Exclusive and Featured Badges */}
                <div className="restaurant-badges">
                    {restaurant.exclusive && (
                        <span className="restaurant-badge exclusive-badge">
                            EXCLUSIVE
                        </span>
                    )}

                    {restaurant.featured && (
                        <span className="restaurant-badge featured-badge">
                            RECOMMENDED
                        </span>
                    )}
                </div>
            </Link>

            {/* Restaurant Content */}
            <div className="restaurant-content">
                <div className="restaurant-main-details">

                    {/* Cuisine, Price, and Rating */}
                    <div className="restaurant-metadata">

                        <span className="restaurant-cuisine">
                            {restaurant.cuisine}
                        </span>

                        <div className="restaurant-price-rating">

                            <span className="restaurant-price">
                                {restaurant.priceRange}
                            </span>

                            <span className="metadata-separator">•</span>

                            <div className="restaurant-rating">
                                <Star size={12} fill="currentColor" />
                                <span className="rating-value">
                                    {dummyRating.toFixed(1)}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Restaurant Name */}
                    <Link
                        to={`/restaurant/${restaurant.slug}`}
                        className="restaurant-title-link"
                    >
                        <h3 className="restaurant-title">
                            {restaurant.name}
                        </h3>
                    </Link>

                    {/* Restaurant Location */}
                    <p className="restaurant-location">
                        <MapPinIcon size={14} />
                        <span>{restaurant.location}</span>
                    </p>
                </div>

                {/* Quick Reservation Slots */}
                <div className="quick-reservations">
                    <div className="reservation-divider"></div>

                    <span className="reservation-label">
                        QUICK RESERVATION
                    </span>

                    <div className="reservation-slots">

                        {restaurant.availableSlots
                            .filter((slot) => {
                                const [slotHour, slotMinute] = slot
                                    .split(":")
                                    .map(Number);

                                const now = new Date();

                                const currentHour = now.getHours();
                                const currentMinute = now.getMinutes();

                                return (
                                    slotHour > currentHour ||
                                    (
                                        slotHour === currentHour &&
                                        slotMinute > currentMinute
                                    )
                                );
                            })
                            .slice(0, 3)
                            .map((slot) => (
                                <button
                                    key={slot}
                                    onClick={(e) =>
                                        handleSlotClick(e, slot)
                                    }
                                    className="reservation-slot-button"
                                >
                                    {slot}
                                </button>
                            ))}

                        <Link
                            to={`/restaurant/${restaurant.slug}`}
                            className="all-slots-link"
                        >
                            ALL SLOTS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}