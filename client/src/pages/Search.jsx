import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {SlidersHorizontal, Search as SearchIcon, X, Check, MapPin, SearchXIcon} from "lucide-react";
import "../styles/Search.css";
import toast from "react-hot-toast";
import api from "../lib/api"

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [restaurants, setRestaurants] = useState([]); //Stores the restaurant list.
    const [loading, setLoading] = useState(true); //Indicates whether restaurant data is loading.

    // Controls the mobile filter drawer
    const [showMobileFilters, setShowMobileFilters] = useState(false); //Controls whether the mobile filter drawer is visible.

    // Read filter values from URL parameters
    const searchVal = searchParams.get("search") || "";
    const locationVal = searchParams.get("location") || "";
    const cuisinesSelected = searchParams.getAll("cuisine");
    const pricesSelected = searchParams.getAll("priceRange");
    const sortVal = searchParams.get("sort") || "";

    // Temporary input values
    const [tempSearch, setTempSearch] = useState(searchVal);  //Stores the search text while the user types.
    const [tempLocation, setTempLocation] = useState(locationVal); //Stores the location while the user types.

    // Synchronize the input fields with URL changes
    useEffect(() => {
        setTempSearch(searchVal);
        setTempLocation(locationVal);
    }, [searchVal, locationVal]);

    // Load the sample restaurant data
    useEffect(() => {
        const fetchRestaurants = async () => {
            try{
                setLoading(true);
                const res = await api.get(`/restaurants?${searchParams.toString()}`)
                setRestaurants(res.data)
            }
            catch(error){
                toast.error(error?.response?.data?.message || error?.message)
            }
            finally{
                setLoading(false)
            }
        };
        fetchRestaurants();
    }, [searchParams]);

    // Submit the search form: updates the URL with the search term and location when the user submits the form.
    const handleTextSubmit = (e) => {
        e.preventDefault();
        const nextParams = new URLSearchParams(searchParams);

        if (tempSearch) {
            nextParams.set("search", tempSearch);
        } else {
            nextParams.delete("search");
        }

        if (tempLocation) {
            nextParams.set("location", tempLocation);
        } else {
            nextParams.delete("location");
        }
        setSearchParams(nextParams);
    };

    // Add or remove a cuisine filter
    const handleCuisineToggle = (cuisine) => {
        const nextParams = new URLSearchParams(searchParams);
        const current = nextParams.getAll("cuisine");

        if (current.includes(cuisine)) {
            const updated = current.filter((c) => c !== cuisine);
            nextParams.delete("cuisine");
            updated.forEach((c) => {
                nextParams.append("cuisine", c);
            });
        } else {
            nextParams.append("cuisine", cuisine);
        }
        setSearchParams(nextParams);
    };

    // Add or remove a price filter
    const handlePriceToggle = (price) => {
        const nextParams = new URLSearchParams(searchParams);
        const current = nextParams.getAll("priceRange");

        if (current.includes(price)) {
            const updated = current.filter((p) => p !== price);
            nextParams.delete("priceRange");

            updated.forEach((p) => {
                nextParams.append("priceRange", p);
            });
        } else {
            nextParams.append("priceRange", price);
        }
        setSearchParams(nextParams);
    };

    // Update the sorting option
    const handleSortChange = (sort) => {
        const nextParams = new URLSearchParams(searchParams);

        if (sort) {
            nextParams.set("sort", sort);
        } else {
            nextParams.delete("sort");
        }

        setSearchParams(nextParams);
    };

    // Clear all filters and search inputs
    const clearAllFilters = () => {
        setSearchParams(new URLSearchParams());

        setTempSearch("");
        setTempLocation("");
    };

    const priceOptions = ["$", "$$", "$$$", "$$$$"];

    const cuisineOptions = [
        "Italian",
        "French",
        "Japanese",
        "Steakhouse",
        "Vegetarian",
    ];

    return (
        <div className="search-page">
            <Navbar />
            <AuthModal />

            {/* Search bar and location input */}
            <div className="search-toolbar">
                <div className="search-toolbar-container">
                    <form
                        onSubmit={handleTextSubmit}
                        className="search-form"
                    >
                        <div className="search-input-wrapper">
                            <SearchIcon
                                size={16}
                                className="search-input-icon"
                            />

                            <input
                                type="text"
                                placeholder="Search cuisine or name..."
                                value={tempSearch}
                                onChange={(e) =>
                                    setTempSearch(e.target.value)
                                }
                                className="search-input"
                            />
                        </div>

                        <div className="search-input-wrapper">
                            <MapPin
                                size={16}
                                className="search-input-icon"
                            />

                            <input
                                type="text"
                                placeholder="Location..."
                                value={tempLocation}
                                onChange={(e) =>
                                    setTempLocation(e.target.value)
                                }
                                className="search-input"
                            />
                        </div>

                        <button
                            type="submit"
                            className="search-update-button"
                        >
                            UPDATE
                        </button>
                    </form>

                    <div className="mobile-filter-trigger">
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(true)}
                            className="mobile-filter-button"
                        >
                            <SlidersHorizontal size={14} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="search-main">
                {/* Desktop filter sidebar */}
                <aside className="desktop-filter-sidebar">
                    <div className="desktop-filter-content">
                        <div className="filter-heading">
                            <h3>Filters</h3>

                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="clear-filters-link"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Cuisine filters */}
                        <div className="filter-group">
                            <h4>Cuisine</h4>

                            <div className="cuisine-filter-list">
                                {cuisineOptions.map((cuisine) => {
                                    const active =
                                        cuisinesSelected.includes(cuisine);

                                    return (
                                        <button
                                            type="button"
                                            key={cuisine}
                                            onClick={() =>
                                                handleCuisineToggle(cuisine)
                                            }
                                            className="cuisine-filter-button"
                                        >
                                            <span>{cuisine}</span>

                                            <span
                                                className={`filter-checkbox ${
                                                    active ? "selected" : ""
                                                }`}
                                            >
                                                {active && <Check size={10} />}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price filters */}
                        <div className="filter-group">
                            <h4>Price Range</h4>

                            <div className="price-filter-grid">
                                {priceOptions.map((price) => {
                                    const active =
                                        pricesSelected.includes(price);

                                    return (
                                        <button
                                            type="button"
                                            key={price}
                                            onClick={() =>
                                                handlePriceToggle(price)
                                            }
                                            className={`price-filter-button ${
                                                active ? "selected" : ""
                                            }`}
                                        >
                                            {price}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Restaurant results */}
                <div className="search-results">
                    <div className="results-header">
                        <p className="results-count">
                            {restaurants.length}{" "}
                            {restaurants.length === 1
                                ? "Restaurant"
                                : "Restaurants"}{" "}
                            Available
                        </p>

                        <div className="sort-controls">
                            <label htmlFor="sort-restaurants">
                                SORT BY:
                            </label>

                            <select
                                id="sort-restaurants"
                                value={sortVal}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="sort-select"
                            >
                                <option value="">Default (Newest)</option>

                                <option value="price_low">
                                    Price: Low to High
                                </option>

                                <option value="price_high">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Loading state */}
                    {loading ? (
                        <div className="results-loading">
                            <div className="results-spinner"></div>
                        </div>
                    ) : restaurants.length === 0 ? (
                        /* Empty results state */
                        <div className="no-results">
                            <SearchXIcon
                                size={36}
                                className="no-results-icon"
                            />

                            <h3>No Restaurants Found</h3>

                            <p>
                                We couldn't find any premium establishments matching your search query. Try widening your filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="clear-all-button"
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>
                    ) : (
                        /* Restaurant cards */
                        <div className="restaurant-results-grid">
                            {restaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant._id}
                                    restaurant={restaurant}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile filter drawer */}
            {showMobileFilters && (
                <div
                    className="mobile-filter-overlay"
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div
                        className="mobile-filter-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mobile-filter-content">
                            <div className="mobile-filter-heading">
                                <h3>Filters</h3>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowMobileFilters(false)
                                    }
                                    className="mobile-filter-close"
                                    aria-label="Close filters"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile cuisine filters */}
                            <div className="mobile-filter-group">
                                <h4>Cuisine</h4>

                                <div className="cuisine-filter-list">
                                    {cuisineOptions.map((cuisine) => {
                                        const active =
                                            cuisinesSelected.includes(cuisine);

                                        return (
                                            <button
                                                type="button"
                                                key={cuisine}
                                                onClick={() =>
                                                    handleCuisineToggle(cuisine)
                                                }
                                                className="cuisine-filter-button"
                                            >
                                                <span>{cuisine}</span>

                                                <span
                                                    className={`filter-checkbox ${
                                                        active ? "selected" : ""
                                                    }`}
                                                >
                                                    {active && (
                                                        <Check size={10} />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mobile price filters */}
                            <div className="mobile-filter-group mobile-price-group">
                                <h4>Price Range</h4>

                                <div className="price-filter-grid">
                                    {priceOptions.map((price) => {
                                        const active =
                                            pricesSelected.includes(price);

                                        return (
                                            <button
                                                type="button"
                                                key={price}
                                                onClick={() =>
                                                    handlePriceToggle(price)
                                                }
                                                className={`price-filter-button ${
                                                    active ? "selected" : ""
                                                }`}
                                            >
                                                {price}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Drawer actions */}
                        <div className="mobile-filter-actions">
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="mobile-clear-button"
                            >
                                CLEAR
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMobileFilters(false)
                                }
                                className="mobile-apply-button"
                            >
                                APPLY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}