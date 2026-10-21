import { Star } from "lucide-react";
import { dummyReviews } from "../../assets/assets.js";
import "../../styles/RestaurantReviews.css";

export default function RestaurantReviews() {
    return (
        <section className="restaurant-reviews">
            <h3 className="restaurant-reviews-title">
                Guest Experiences
            </h3>

            {/* Reviews list */}
            <div className="restaurant-reviews-list">
                {dummyReviews.length === 0 ? (
                    <p className="restaurant-no-reviews">
                        No reviews yet. Be the first to share your experience!
                    </p>
                ) : (
                    dummyReviews.map((review) => (
                        <div
                            key={review._id}
                            className="restaurant-review-item"
                        >
                            <div className="restaurant-review-header">
                                <div>
                                    <h4 className="restaurant-reviewer-name">
                                        {review.userName}
                                    </h4>

                                    <span className="restaurant-review-date">
                                        Visited{" "}
                                        {new Date(
                                            review.visitedDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <div
                                    className="restaurant-review-rating"
                                    aria-label={`${review.rating} out of 5 stars`}
                                >
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            size={12}
                                            fill={
                                                index < review.rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                            className={
                                                index < review.rating
                                                    ? ""
                                                    : "restaurant-empty-star"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="restaurant-review-comment">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}