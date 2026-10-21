import { useState, useEffect } from "react";
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

import {
    dummyMyBookingsData,
    dummyRestaurant,
} from "../../assets/assets.js";

import "../../styles/OwnerDashboard.css";

export default function OwnerDashboard() {
    const { logout } = useAppContext();

    const [restaurant, setRestaurant] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bookings");

    const fetchOwnerData = async () => {
        setRestaurant(dummyRestaurant[0]);
        setBookings(dummyMyBookingsData);
        setLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchOwnerData();
        };

        loadData();
    }, []);

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
                                    {restaurant.name.charAt(0)}
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

                            {/* Bookings tab */}
                            {activeTab === "bookings" && (
                                <OwnerBookings
                                    bookings={bookings}
                                    setBookings={setBookings}
                                    totalSeats={restaurant.totalSeats}
                                />
                            )}

                            {/* Profile details tab */}
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