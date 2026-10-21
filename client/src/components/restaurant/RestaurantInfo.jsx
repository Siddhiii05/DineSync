import { MapPin, Clock, Utensils, ChefHat } from "lucide-react";
import "../../styles/RestaurantInfo.css";

export default function RestaurantInfo({ restaurant }) {
    if (!restaurant) return null;

    return (
        <div className="restaurant-info">
            {/* Info Ribbon */}
            <div className="restaurant-info-ribbon">
                <div className="restaurant-info-item restaurant-info-bordered">
                    <ChefHat
                        className="restaurant-info-icon"
                        size={20}
                    />
                    <span className="restaurant-info-label">
                        CHEF
                    </span>
                    <span className="restaurant-info-value">
                        {restaurant.chef}
                    </span>
                </div>

                <div className="restaurant-info-item restaurant-info-bordered">
                    <Utensils
                        className="restaurant-info-icon"
                        size={20}
                    />
                    <span className="restaurant-info-label">
                        CUISINE
                    </span>
                    <span className="restaurant-info-value">
                        {restaurant.cuisine}
                    </span>
                </div>

                <div className="restaurant-info-item">
                    <Clock
                        className="restaurant-info-icon"
                        size={20}
                    />
                    <span className="restaurant-info-label">
                        OPENING
                    </span>
                    <span className="restaurant-info-value">
                        5:00 PM - 11:00 PM
                    </span>
                </div>
            </div>

            {/* About Section */}
            <section className="restaurant-about">
                <h3 className="restaurant-about-title">
                    About the Dining Room
                </h3>

                <p className="restaurant-about-description">
                    {restaurant.description}
                </p>

                <div className="restaurant-address">
                    <MapPin
                        size={16}
                        className="restaurant-address-icon"
                    />
                    <span>{restaurant.address}</span>
                </div>
            </section>
        </div>
    );
}