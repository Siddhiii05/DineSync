import { Star } from "lucide-react";
import { dummyRating, dummyReviewCount } from "../../assets/assets.js";
import "../../styles/RestaurantHero.css";

export default function RestaurantHero({ restaurant }) {
    if (!restaurant) return null;

    return (
        <section className="restaurant-hero">
            <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-hero-image"
            />

            <div className="restaurant-hero-overlay"></div>

            <div className="restaurant-hero-info">
                <div className="restaurant-hero-container">
                    <div className="restaurant-hero-details">
                        <div className="restaurant-hero-badges">
                            <span className="restaurant-cuisine-badge">
                                {restaurant.cuisine}
                            </span>

                            {restaurant.exclusive && (
                                <span className="restaurant-exclusive-badge">
                                    EXCLUSIVE CLUB
                                </span>
                            )}
                        </div>

                        <h1 className="restaurant-hero-title">
                            {restaurant.name}
                        </h1>

                        <div className="restaurant-hero-metadata">
                            <div className="restaurant-hero-rating">
                                <Star size={14} fill="currentColor" />

                                <span className="restaurant-rating-value">
                                    {dummyRating.toFixed(1)}
                                </span>
                            </div>

                            <span className="restaurant-metadata-separator">
                                •
                            </span>

                            <span>{dummyReviewCount} Reviews</span>

                            <span className="restaurant-metadata-separator">
                                •
                            </span>

                            <span>Price: {restaurant.priceRange}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}