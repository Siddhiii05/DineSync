import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Loader from "../../components/Loader.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import api from "../../lib/api.js";

import {
  ShieldCheckIcon,
  CheckCircleIcon,
  BarChart3Icon,
} from "lucide-react";

import AdminApprovals from "../../components/admin/AdminApprovals.jsx";
import AdminStats from "../../components/admin/AdminStats.jsx";

import "../../styles/AdminDashboard.css";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { logout } = useAppContext();

  const [restaurants, setRestaurants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("approvals");
  const [btnLoading, setBtnLoading] = useState(null);

  // Fetch restaurants and dashboard statistics
  const fetchAdminData = async () => {
    try {
      const rRes = await api.get("/admin/restaurants");
      setRestaurants(
        Array.isArray(rRes.data) ? rRes.data : rRes.data.restaurants || []
      );

      const sRes = await api.get("/admin/stats");
      setStats(sRes.data);
    } catch (error) {
      console.error("Failed to retrieve administrator data:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to retrieve administrator data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject a restaurant
  const handleApproveStatus = async (restaurantId, status) => {
    try {
      setBtnLoading(restaurantId);
      await api.put(`/admin/restaurants/${restaurantId}/approve`, {
        status,
      });

      toast.success(`Restaurant has been marked as ${status}`);

      // Refresh restaurant list
      const rRes = await api.get("/admin/restaurants");
      setRestaurants(
        Array.isArray(rRes.data) ? rRes.data : rRes.data.restaurants || []
      );

      // Refresh statistics
      const sRes = await api.get("/admin/stats");
      setStats(sRes.data);
    } catch (error) {
      console.error("Failed to update restaurant status:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update restaurant status"
      );
    } finally {
      setBtnLoading(null);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Show loader while data is loading
  if (loading) {
    return <Loader text="Loading Master Admin Console..." />;
  }

  // Separate pending and processed restaurants
  const pendingRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === "pending"
  );

  const otherRestaurants = restaurants.filter(
    (restaurant) => restaurant.status !== "pending"
  );

  return (
    <div className="admin-dashboard-page">
      <Navbar />

      <main className="admin-dashboard-main">
        {/* Dashboard Heading */}
        <header className="admin-dashboard-header">
          <div>
            <h1 className="admin-dashboard-title">
              <ShieldCheckIcon
                size={28}
                className="admin-dashboard-title-icon"
              />
              Admin Console
            </h1>

            <p className="admin-dashboard-description">
              Approve new restaurant partners, audit active slot listings,
              and review platform booking metrics.
            </p>
          </div>

          <button
            onClick={logout}
            className="admin-signout-button"
          >
            Sign Out
          </button>
        </header>

        <div className="admin-dashboard-layout">
          {/* Sidebar Navigation */}
          <aside className="admin-dashboard-sidebar">
            <nav className="admin-dashboard-nav">
              <button
                onClick={() => setActiveTab("approvals")}
                className={`admin-nav-button ${
                  activeTab === "approvals"
                    ? "admin-nav-button-active"
                    : ""
                }`}
              >
                <CheckCircleIcon size={14} />

                <span>
                  Approvals ({pendingRestaurants.length} Pending)
                </span>
              </button>

              <button
                onClick={() => setActiveTab("stats")}
                className={`admin-nav-button ${
                  activeTab === "stats"
                    ? "admin-nav-button-active"
                    : ""
                }`}
              >
                <BarChart3Icon size={14} />

                <span>Analytics &amp; Stats</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="admin-dashboard-content">
            {activeTab === "approvals" && (
              <AdminApprovals
                pendingRestaurants={pendingRestaurants}
                otherRestaurants={otherRestaurants}
                btnLoading={btnLoading}
                onApproveStatus={handleApproveStatus}
              />
            )}

            {activeTab === "stats" && stats && (
              <AdminStats stats={stats} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
