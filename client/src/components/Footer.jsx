import { Link } from "react-router-dom";
import {bottomLinks, footerSections, socialLinks} from "../assets/assets.js";
import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">

            {/* Brand and Main Sections */}
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo-link">
                        <img
                            src="/logo.png"
                            alt="DineSync Logo"
                            className="footer-logo"
                        />
                    </Link>

                    <p className="footer-description">
                        Connecting discerning palates with the world's most exceptional culinary experiences.
                    </p>
                </div>

                {/* Dynamic Sections */}
                {footerSections.map((section) => (
                    <div key={section.title} className="footer-section">
                        <h4 className="footer-heading">
                            {section.title}
                        </h4>

                        {section.links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className="footer-link"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ))}

                {/* Contact */}
                <div className="footer-contact">
                    <h4 className="footer-heading">
                        CONTACT
                    </h4>

                    <p className="footer-email">
                        support@example.com
                    </p>

                    <div className="footer-social-links">
                        {socialLinks.map(({ icon: Icon, href }, index) => (
                            <a
                                key={index}
                                href={href}
                                className="footer-social-link"
                                aria-label={`Social media link ${index + 1}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">

                <p className="footer-copyright">
                    © 2026 DineSync. All rights reserved.
                </p>

                <div className="footer-bottom-links">
                    {bottomLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.path}
                            className="footer-bottom-link"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}