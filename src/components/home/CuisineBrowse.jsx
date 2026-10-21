import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cuisines } from "../../assets/assets.js";
import "../../styles/CuisineBrowse.css";

export default function CuisineBrowse() {
    const navigate = useNavigate();

    const handleCuisineClick = (cuisineName) => {
        navigate(`/search?cuisine=${encodeURIComponent(cuisineName)}`);
    };

    return (
        <section className="cuisine-section">
            <div className="cuisine-header">
                <div>
                    <span className="cuisine-subtitle">
                        CURATED SELECTION
                    </span>

                    <h2 className="cuisine-title">
                        Browse by Cuisine
                    </h2>
                </div>

                <Link to="/search" className="cuisine-explore-link">
                    EXPLORE ALL
                    <ArrowRight size={14} className="cuisine-arrow" />
                </Link>
            </div>

            <div className="cuisine-grid">
                {cuisines.map((c) => {
                    const Icon = c.icon;

                    return (
                        <button
                            key={c.name}
                            onClick={() => handleCuisineClick(c.name)}
                            className="cuisine-card"
                        >
                            <Icon
                                size={32}
                                strokeWidth={1.1}
                                className="cuisine-icon"
                            />

                            <span className="cuisine-label">
                                {c.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}