import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { assets } from "../../assets/assets.js";
import "../../styles/Hero.css";

export default function Hero() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (searchQuery) params.append("search", searchQuery);
        if (location) params.append("location", location);
        if (date) params.append("date", date);
        if (guests) params.append("guests", guests);

        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="hero-section">
            {/* Background Image */}
            <div className="hero-background">
                <img
                    src={assets.hero_bg_img}
                    alt="Elegant Dining Room"
                    className="hero-background-image"
                />

                <div className="hero-overlay"></div>
            </div>

            {/* Main Content */}
            <div className="hero-content">
                <span className="hero-subtitle">
                    EXQUISITE DINING EXPERIENCES
                </span>

                <h1 className="hero-title">
                    Curation for the Discerning Palette
                </h1>

                {/* Search Form */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hero-search-form"
                >
                    {/* Restaurant or Cuisine */}
                    <div className="hero-input-group">
                        <Search size={18} className="hero-input-icon" />

                        <input
                            type="text"
                            placeholder="Search cuisines, restaurants..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                            className="hero-input"
                        />
                    </div>

                    {/* Location */}
                    <div className="hero-input-group">
                        <MapPin size={18} className="hero-input-icon" />

                        <input
                            type="text"
                            placeholder="Location (e.g. Manhattan)"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            className="hero-input"
                        />
                    </div>

                    {/* Reservation Date */}
                    <div className="hero-input-group">
                        <Calendar size={18} className="hero-input-icon" />

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            className="hero-input hero-date-input"
                        />
                    </div>

                    {/* Number of Guests */}
                    <div className="hero-input-group">
                        <Users size={18} className="hero-input-icon" />

                        <select
                            value={guests}
                            onChange={(e) =>
                                setGuests(e.target.value)
                            }
                            className="hero-input hero-guest-select"
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="8">8 Guests</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="hero-search-button"
                    >
                        FIND A TABLE
                    </button>
                </form>
            </div>
        </section>
    );
}