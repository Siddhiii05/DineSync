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
import "../styles/RestaurantDetail.css";
import api from "../lib/api";

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
      try {
        setLoading(true);
        const res = await api.get(`/restaurants/${slug}`);
        setRestaurant(res.data);

        //Initialize booking values
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRestaurant();
    }
  }, [slug, navigate]);

  // Load available booking slots
  useEffect(() => {
    const fetchAvailability = async () => {
      // Don't fetch availability until restaurant details and date are available.
      if (!restaurant?._id || !selectedDate) {
        return;
      }

      try {
        setLoadingSlots(true);

        const res = await api.get(
          `/restaurants/${restaurant._id}/availability?date=${selectedDate}`,
        );

        setSlotsAvailability(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch restaurant availability:",
          error.response?.data || error.message,
        );

        setSlotsAvailability([]);
      } finally {
        setLoadingSlots(false);
      }
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
      `/booking/${restaurant.slug}?slot=${selectedSlot}&date=${selectedDate}&guests=${selectedGuests}`,
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

          <button type="button" onClick={() => navigate("/search")}>
            Explore Restaurants
          </button>
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
