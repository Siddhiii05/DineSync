import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import {Menu,X,LogOut,LayoutDashboard,ShieldCheck} from "lucide-react";
import { assets } from "../assets/assets.js";
import "../styles/Navbar.css";

export default function Navbar() {
    const { user, logout, setAuthModalOpen } = useAppContext();

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Detect page scrolling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close menus when the route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location]);

    // Handle dashboard navigation
    const handleDashboardClick = () => {
        if (!user) {
            setAuthModalOpen(true);
        } else {
            navigate("/dashboard");
        }
    };

    const isHomePage = location.pathname === "/";
    const useDarkNavbar = scrolled || !isHomePage;

    return (
        <nav
            className={`navbar ${
                scrolled ? "navbar-scrolled" : "navbar-transparent"
            }`}
        >
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo-link">
                        <img
                            src={assets.logo}
                            alt="DineSync Logo"
                            className={`navbar-logo ${
                                scrolled || isHomePage
                                    ? "navbar-logo-invert"
                                    : ""
                            }`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="desktop-navigation">
                        <Link
                            to="/"
                            className={`nav-link ${
                                isHomePage
                                    ? scrolled
                                        ? "nav-link-active"
                                        : "nav-link-home-active"
                                    : "nav-link-inactive"
                            }`}
                        >
                            Discover
                        </Link>

                        <Link
                            to="/search"
                            className={`nav-link ${
                                location.pathname.startsWith("/search")
                                    ? "nav-link-active"
                                    : useDarkNavbar
                                        ? "nav-link-inactive"
                                        : "nav-link-light"
                            }`}
                        >
                            Restaurants
                        </Link>

                        <button
                            onClick={handleDashboardClick}
                            className={`nav-link nav-button ${
                                location.pathname === "/dashboard"
                                    ? "nav-link-active"
                                    : useDarkNavbar
                                        ? "nav-link-inactive"
                                        : "nav-link-light"
                            }`}
                        >
                            My Bookings
                        </button>
                    </div>
                </div>

                {/* Desktop Authentication Actions */}
                <div className="desktop-auth-actions">
                    {user ? (
                        <div className="profile-container">
                            <button
                                onClick={() =>
                                    setDropdownOpen(!dropdownOpen)
                                }
                                className={`profile-button ${
                                    useDarkNavbar
                                        ? "profile-dark"
                                        : "profile-light"
                                }`}
                            >
                                <span className="profile-avatar">
                                    {user.name.charAt(0)}
                                </span>

                                <span className="profile-first-name">
                                    {user.name.split(" ")[0]}
                                </span>
                            </button>

                            {/* Profile Dropdown */}
                            {dropdownOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-user-info">
                                        <p className="dropdown-user-name">
                                            {user.name}
                                        </p>

                                        <p className="dropdown-user-email">
                                            {user.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleDashboardClick}
                                        className="dropdown-item"
                                    >
                                        <LayoutDashboard size={14} />
                                        My Bookings
                                    </button>

                                    {user.role === "admin" && (
                                        <Link to="/admin/dashboard" className="dropdown-item">
                                            <ShieldCheck size={14} />
                                            Admin Panel
                                        </Link>
                                    )}

                                    {user.role === "owner" && (
                                        <Link to="/owner/dashboard" className="dropdown-item">
                                            <ShieldCheck size={14} />
                                            Owner Panel
                                        </Link>
                                    )}

                                    <button onClick={logout} className="dropdown-item dropdown-logout">
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className={`sign-in-button ${
                                    useDarkNavbar
                                        ? "sign-in-dark"
                                        : "sign-in-light"
                                }`}
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className={`sign-up-button ${
                                    useDarkNavbar
                                        ? "sign-up-dark"
                                        : "sign-up-light"
                                }`}
                            >
                                Sign Up
                            </button>
                        </>
                    )}

                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-menu-toggle">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`mobile-menu-button ${
                            useDarkNavbar
                                ? "mobile-menu-dark"
                                : "mobile-menu-light"
                        }`}
                        aria-label="Toggle Menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="mobile-navigation">
                    <Link to="/" className="mobile-nav-link">
                        Discover
                    </Link>

                    <Link to="/search" className="mobile-nav-link">
                        Restaurants
                    </Link>

                    <button onClick={handleDashboardClick} className="mobile-nav-link mobile-nav-button" >Reservations</button>

                    <div className="mobile-divider"></div>

                    {user ? (
                        <div className="mobile-user-section">
                            <div className="mobile-user-info">
                                <span className="mobile-avatar">
                                    {user.name.charAt(0)}
                                </span>

                                <div>
                                    <p className="mobile-user-name">{user.name}</p>
                                    <p className="mobile-user-email">{user.email}</p>
                                </div>
                            </div>

                            <Link to="/dashboard" className="mobile-account-link" >My Bookings</Link>

                            {user.role === "admin" && (
                                <Link to="/admin/dashboard" className="mobile-account-link">Admin Console</Link>
                            )}

                            {user.role === "owner" && (
                                <Link to="/owner/dashboard" className="mobile-account-link">Owner Console</Link>
                            )}

                            <button onClick={logout} className="mobile-logout-button">Sign Out</button>
                        </div>
                    ) : (
                        <div className="mobile-auth-actions">
                            <button onClick={() => setAuthModalOpen(true)} className="mobile-sign-in">Sign In</button>
                            <button onClick={() => setAuthModalOpen(true)} className="mobile-sign-up">Sign Up</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}