import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Loader from "../../components/Loader.jsx";
import { CalendarIcon, SettingsIcon } from "lucide-react";

import RestaurantWizard from "../../components/owner/RestaurantWizard.jsx";
import PendingApproval from "../../components/owner/PendingApproval.jsx";
import RequestRejected from "../../components/owner/RequestRejected.jsx";
import OwnerBookings from "../../components/owner/OwnerBookings.jsx";
import OwnerProfileDetails from "../../components/owner/OwnerProfileDetails.jsx";
import api from "../../lib/api.js";
import "../../styles/OwnerDashboard.css";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
    const { logout } = useAppContext();

    const [restaurant, setRestaurant] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bookings");

    const fetchOwnerData = useCallback(async () => {
        setLoading(true);

        try {
            // Fetch the logged-in owner's restaurant.
            const restaurantRes = await api.get("/owner/restaurant");
            const restaurantData = restaurantRes.data;

            setRestaurant(restaurantData);

            // Reset bookings before loading fresh data.
            setBookings([]);

            // Fetch bookings only when the restaurant is approved.
            if (restaurantData?.status === "approved") {
                const bookingRes = await api.get("/owner/bookings");

                // The backend returns an array directly.
                const bookingData = Array.isArray(bookingRes.data)
                    ? bookingRes.data
                    : Array.isArray(bookingRes.data?.bookings)
                      ? bookingRes.data.bookings
                      : [];

                setBookings(bookingData);
            }
        } catch (error) {
            console.error("Failed to load owner dashboard:", error);

            setBookings([]);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load dashboard data"
            );
        } finally {
            // Always stop loading, regardless of success or failure.
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOwnerData();
    }, [fetchOwnerData]);

    if (loading) {
        return <Loader text="Loading Owner Dashboard..." />;
    }

    return (
        <div className="owner-dashboard">
            <Navbar />

            <main className="owner-main">
                {/* Heading */}
                <div className="owner-heading">
                    <div>
                        <h1 className="owner-title">
                            Restaurant Portal
                        </h1>

                        <p className="owner-subtitle">
                            Review capacity limits and process live reservations.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="owner-signout-button"
                    >
                        Sign Out
                    </button>
                </div>

                {/* No restaurant profile */}
                {!restaurant ? (
                    <RestaurantWizard
                        setRestaurant={setRestaurant}
                    />
                ) : restaurant.status === "pending" ? (
                    /* Restaurant awaiting approval */
                    <PendingApproval restaurant={restaurant} />
                ) : restaurant.status === "rejected" ? (
                    /* Restaurant application rejected */
                    <RequestRejected
                        restaurantName={restaurant.name}
                    />
                ) : (
                    /* Approved restaurant dashboard */
                    <div className="owner-dashboard-grid">

                        {/* Sidebar */}
                        <aside className="owner-sidebar">
                            <div className="owner-restaurant-profile">
                                <span className="owner-restaurant-avatar">
                                    {restaurant.name?.charAt(0) || "R"}
                                </span>

                                <div className="owner-restaurant-info">
                                    <h4 className="owner-restaurant-name">
                                        {restaurant.name}
                                    </h4>

                                    <span className="owner-status-badge">
                                        APPROVED
                                    </span>
                                </div>
                            </div>

                            {/* Dashboard tabs */}
                            <nav className="owner-tabs">
                                <button
                                    onClick={() =>
                                        setActiveTab("bookings")
                                    }
                                    className={`owner-tab ${
                                        activeTab === "bookings"
                                            ? "owner-tab-active"
                                            : ""
                                    }`}
                                >
                                    <CalendarIcon size={14} />

                                    <span>
                                        Bookings ({bookings.length})
                                    </span>
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab("details")
                                    }
                                    className={`owner-tab ${
                                        activeTab === "details"
                                            ? "owner-tab-active"
                                            : ""
                                    }`}
                                >
                                    <SettingsIcon size={14} />

                                    <span>Profile Details</span>
                                </button>
                            </nav>
                        </aside>

                        {/* Main content */}
                        <div className="owner-content">
                            {activeTab === "bookings" && (
                                <OwnerBookings
                                    bookings={bookings}
                                    setBookings={setBookings}
                                    totalSeats={restaurant.totalSeats}
                                />
                            )}

                            {activeTab === "details" && (
                                <OwnerProfileDetails
                                    restaurant={restaurant}
                                    setRestaurant={setRestaurant}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
