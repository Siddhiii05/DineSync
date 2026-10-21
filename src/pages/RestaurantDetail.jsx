import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Loader from "../components/Loader.jsx";
import RestaurantHero from "../components/restaurant/RestaurantHero.jsx";
import RestaurantInfo from "../components/restaurant/RestaurantInfo.jsx";
import RestaurantReviews from "../components/restaurant/RestaurantReviews.jsx";
import BookingWidget from "../components/restaurant/BookingWidget.jsx";
import toast from "react-hot-toast";
import { dummyAvailability, dummyRestaurant} from "../assets/assets.js";
import "../styles/RestaurantDetail.css";

export default function RestaurantDetail() {
    const { slug } = useParams();

    const { isAuthenticated, setAuthModalOpen } = useAppContext();

    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking widget states
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedGuests, setSelectedGuests] = useState("2");
    const [selectedSlot, setSelectedSlot] = useState("");

    const [slotsAvailability, setSlotsAvailability] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Load restaurant details
    useEffect(() => {
        const fetchRestaurant = async () => {
            setRestaurant(
                dummyRestaurant.find((restaurant) => restaurant.slug === slug) ||
                    null
            );

            setLoading(false);
        };

        if (slug) {
            fetchRestaurant();
        } else {
            setRestaurant(null);
            setLoading(false);
        }
    }, [slug]);

    // Load available booking slots
    useEffect(() => {
        const fetchAvailability = async () => {
            setLoadingSlots(true);

            setSlotsAvailability(dummyAvailability);

            setLoadingSlots(false);
        };

        fetchAvailability();
    }, [restaurant?._id, selectedDate]);

    // Handle the reservation button
    const handleReserveClick = () => {
        if (!selectedSlot) {
            toast.error("Please select a dining time slot.");
            return;
        }

        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        navigate(
            `/booking/${restaurant.slug}?slot=${encodeURIComponent(
                selectedSlot
            )}&date=${encodeURIComponent(
                selectedDate
            )}&guests=${encodeURIComponent(selectedGuests)}`
        );
    };

    // Display a loader while loading restaurant details
    if (loading) {
        return <Loader text="Loading Restaurant Details..." />;
    }

    // Handle a restaurant that doesn't exist
    if (!restaurant) {
        return (
            <div className="restaurant-not-found">
                <Navbar />

                <main className="restaurant-not-found-content">
                    <h2>Restaurant Not Found</h2>
                    <p>We couldn't find the restaurant you're looking for. </p>

                    <button type="button" onClick={() => navigate("/search")}>Explore Restaurants</button>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="restaurant-detail-page">
            <Navbar />
            <AuthModal />
            {/* Restaurant hero image */}
            <RestaurantHero restaurant={restaurant} />

            {/* Restaurant details and booking widget */}
            <main className="restaurant-detail-main">
                <div className="restaurant-detail-grid">
                    {/* Left column */}
                    <div className="restaurant-detail-information">
                        <RestaurantInfo restaurant={restaurant} />
                        <RestaurantReviews />
                    </div>

                    {/* Right column */}
                    <div className="restaurant-booking-sidebar">
                        <BookingWidget
                            restaurant={restaurant}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedGuests={selectedGuests}
                            setSelectedGuests={setSelectedGuests}
                            selectedSlot={selectedSlot}
                            setSelectedSlot={setSelectedSlot}
                            slotsAvailability={slotsAvailability}
                            loadingSlots={loadingSlots}
                            isAuthenticated={isAuthenticated}
                            handleReserveClick={handleReserveClick}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}