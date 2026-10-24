import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import AuthModal from "../components/AuthModal.jsx";
import api from "../lib/api"
import {CalendarIcon, UsersIcon, ClockIcon, MapPinIcon, CalendarDaysIcon} from "lucide-react";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";

export default function Dashboard() {
    const { user } = useAppContext();

    const [bookings, setBookings] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Load user bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try{
                setLoadingBookings(true);
                const res = await api.get(`/bookings/my`)
                setBookings(res.data)
            }
            catch(error){
                toast.error(error?.response?.data?.message || error?.message);
            }
            finally{
                setLoadingBookings(false)
            }
        };

        if (user) {
            fetchBookings();
        } else {
            setBookings([]);
            setLoadingBookings(false);
        }
    }, [user]);

    // Load restaurant recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            try{
                const res = await api.get("/restaurants/featured");
                setRecommendations(res.data)
            }
            catch(error){
                toast.error(error?.response?.data?.message || error?.message);
            }
        };
        fetchRecommendations();
    }, []);

    // Cancel a booking
    const handleCancelBooking = async (bookingId) => {
        const shouldCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!shouldCancel) return;
        try {
            await api.put(`/bookings/${bookingId}/cancel`)

            //Update local state
            setBookings((prev)=> {
                prev.map((booking) => (booking._id === bookingId ? {...booking, status: "cancelled"}: booking))
            })
            toast.success("Reservation cancelled successfully.");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Unable to cancel the reservation."
            );
        }
    };

    if (!user) {
        return null;
    }

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upcoming confirmed bookings
    const upcomingBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);

        return (
            bookingDate >= today &&
            booking.status === "confirmed"
        );
    });

    // Past and cancelled bookings
    const pastBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);

        return (
            bookingDate < today ||
            booking.status !== "confirmed"
        );
    });

    return (
        <div className="dashboard-page">
            <Navbar />
            <AuthModal />

            <main className="dashboard-main">
                <div className="dashboard-content">
                    {/* Welcome Header */}
                    <div className="dashboard-header">
                        <h2 className="dashboard-welcome-title">
                            Welcome back, {user.name.split(" ")[0]}
                        </h2>

                        <p className="dashboard-welcome-description">
                            Manage your upcoming dining experiences.
                        </p>
                    </div>

                    <div className="dashboard-booking-sections">
                        {/* Upcoming Bookings */}
                        <section className="dashboard-section">
                            <h3 className="dashboard-section-title">
                                Upcoming Bookings
                            </h3>

                            {loadingBookings ? (
                                <div className="dashboard-loading">
                                    <div className="dashboard-spinner"></div>
                                </div>
                            ) : upcomingBookings.length === 0 ? (
                                <div className="dashboard-empty-state">
                                    <CalendarDaysIcon
                                        size={36}
                                        className="dashboard-empty-icon"
                                    />

                                    <p>
                                        No upcoming reservations scheduled.
                                    </p>

                                    <Link
                                        to="/search"
                                        className="dashboard-book-button"
                                    >
                                        Book a Table
                                    </Link>
                                </div>
                            ) : (
                                <div className="dashboard-upcoming-list">
                                    {upcomingBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="dashboard-booking-card"
                                        >
                                            {/* Restaurant Information */}
                                            <div className="dashboard-restaurant-info">
                                                <div className="dashboard-restaurant-image-container">
                                                    <img
                                                        src={
                                                            booking.restaurant?.image
                                                        }
                                                        alt={
                                                            booking.restaurant?.name ||
                                                            "Restaurant"
                                                        }
                                                        className="dashboard-restaurant-image"
                                                    />
                                                </div>

                                                <div className="dashboard-restaurant-details">
                                                    <span className="dashboard-cuisine">
                                                        {booking.restaurant?.cuisine}
                                                    </span>

                                                    <h4 className="dashboard-restaurant-name">
                                                        {booking.restaurant?.name}
                                                    </h4>

                                                    <p className="dashboard-restaurant-location">
                                                        <MapPinIcon size={12} />
                                                        <span>
                                                            {booking.restaurant?.location}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="dashboard-booking-details">
                                                <div className="dashboard-detail-item">
                                                    <CalendarIcon
                                                        size={14}
                                                        className="dashboard-detail-icon"
                                                    />

                                                    <span>
                                                        {new Date(
                                                            booking.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="dashboard-detail-item">
                                                    <ClockIcon
                                                        size={14}
                                                        className="dashboard-detail-icon"
                                                    />

                                                    <span>
                                                        {booking.time} PM
                                                    </span>
                                                </div>

                                                <div className="dashboard-detail-item">
                                                    <UsersIcon
                                                        size={14}
                                                        className="dashboard-detail-icon"
                                                    />

                                                    <span>
                                                        {booking.guests} Guests
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cancel Button */}
                                            <div className="dashboard-booking-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="dashboard-cancel-button"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Dining History */}
                        <section className="dashboard-section">
                            {!loadingBookings &&
                                pastBookings.length > 0 && (
                                    <>
                                        <h3 className="dashboard-section-title">
                                            Dining History
                                        </h3>

                                        <div className="dashboard-history-container">
                                            <table className="dashboard-history-table">
                                                <thead>
                                                    <tr>
                                                        <th>Restaurant</th>
                                                        <th>Date &amp; Time</th>
                                                        <th>Party</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {pastBookings.map(
                                                        (booking) => (
                                                            <tr key={booking._id}>
                                                                <td className="dashboard-history-restaurant">
                                                                    <Link
                                                                        to={`/restaurant/${booking.restaurant?.slug}`}
                                                                    >
                                                                        {booking.restaurant?.name}
                                                                    </Link>
                                                                </td>

                                                                <td>
                                                                    {new Date(
                                                                        booking.date
                                                                    ).toLocaleDateString()}{" "}
                                                                    at{" "}
                                                                    {booking.time} PM
                                                                </td>

                                                                <td>
                                                                    {booking.guests}{" "}
                                                                    {booking.guests ===
                                                                    1
                                                                        ? "Guest"
                                                                        : "Guests"}
                                                                </td>

                                                                <td>
                                                                    <span
                                                                        className={`dashboard-status dashboard-status-${booking.status}`}
                                                                    >
                                                                        {booking.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                        </section>
                    </div>

                    {/* Restaurant Recommendations */}
                    {recommendations.length > 0 && (
                        <section className="dashboard-recommendations">
                            <h3 className="dashboard-section-title">
                                Recommended for You
                            </h3>

                            <div className="dashboard-recommendations-grid">
                                {recommendations
                                    .slice(0, 3)
                                    .map((restaurant) => (
                                        <RestaurantCard
                                            key={restaurant._id}
                                            restaurant={restaurant}
                                        />
                                    ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}