import { assets } from "../../assets/assets.js";
import { BadgeCheck, Armchair } from "lucide-react";
import "../../styles/MembershipSection.css";


export default function MembershipSection() {
    return (
        <section className="membership-section">
            <div className="membership-container">
                {/* Membership Image */}
                <div className="membership-image-container">
                    <img
                        src={assets.membership_section_img}
                        alt="Chef's Table"
                        className="membership-image"
                    />
                </div>

                {/* Membership Content */}
                <div className="membership-content">
                    <span className="membership-subtitle">
                        PREMIUM CLUB MEMBERSHIP
                    </span>

                    <h2 className="membership-title">
                        Access the Exquisite Chef's Table
                    </h2>

                    <p className="membership-description">
                        Join GourmetReserve and receive priority access to seasonal chef collaborations, private dining club events, and table guarantees at high-demand tables.
                    </p>

                    {/* Membership Benefits */}
                    <div className="membership-benefits">
                        <div className="membership-benefit">
                            <BadgeCheck
                                size={20}
                                className="membership-benefit-icon"
                            />
                            <div>
                                <h4 className="membership-benefit-title">
                                    Last-Minute Reservations
                                </h4>

                                <p className="membership-benefit-description">
                                    Unlock tables held exclusively for club members during peak weekends.
                                </p>
                            </div>
                        </div>

                        <div className="membership-benefit">
                            <Armchair
                                size={20}
                                className="membership-benefit-icon"
                            />

                            <div>
                                <h4 className="membership-benefit-title">
                                    Curated Tasting Invites
                                </h4>

                                <p className="membership-benefit-description">
                                    Receive personalized invitations to private kitchen tasting sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}