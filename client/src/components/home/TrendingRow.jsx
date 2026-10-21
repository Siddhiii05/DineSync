import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import RestaurantCard from "../RestaurantCard.jsx";
import "../../styles/TrendingRow.css";

export default function TrendingRow({ trending, loading }) {
    return (
        <section className="trending-section">
            <div className="trending-container">
                <div className="trending-header">
                    <div>
                        <span className="trending-subtitle">
                            CURRENTLY TRENDING
                        </span>

                        <h2 className="trending-title">
                            Trending Fine Dining
                        </h2>
                    </div>

                    <Link
                        to="/search"
                        className="trending-view-all"
                    >
                        VIEW ALL
                        <ArrowRight
                            size={14}
                            className="trending-arrow"
                        />
                    </Link>
                </div>

                {loading ? (
                    <div className="trending-loader-container">
                        <div className="trending-spinner"></div>
                    </div>
                ) : (
                    <div className="trending-grid">
                        {trending.slice(0, 3).map((restaurant) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}