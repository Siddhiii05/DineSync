import toast from "react-hot-toast";
import "../../styles/NewsletterCTA.css";

export default function NewsletterCTA() {
    const handleSubscribe = (e) => {
        e.preventDefault();

        toast.success(
            "Thank you for joining the Culinary Inner Circle!"
        );
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <h2 className="newsletter-title">
                    Join the Culinary Inner Circle
                </h2>

                <p className="newsletter-description">
                    Subscribe to receive first access to new openings and seasonal tasting menus.
                </p>

                <form
                    onSubmit={handleSubscribe}
                    className="newsletter-form"
                >
                    <input
                        className="newsletter-input"
                        placeholder="Email Address"
                        type="email"
                        required
                    />

                    <button type="submit" className="newsletter-button">SUBSCRIBE</button>
                </form>
            </div>
        </section>
    );
}