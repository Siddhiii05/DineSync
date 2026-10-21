import { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { X, Mail, Lock, User, Phone } from "lucide-react";
import "../styles/AuthModal.css";

export default function AuthModal() {
    const {isAuthModalOpen, setAuthModalOpen, login, register } = useAppContext();

    const [isLoginTab, setIsLoginTab] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isOwner, setIsOwner] = useState(false);

    const [formLoading, setFormLoading] = useState(false);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setIsOwner(false);
    };

    const handleClose = () => {
        resetForm();
        setAuthModalOpen(false);
    };

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            let success;

            if (isLoginTab) {
                success = await login(email, password);
            } else {
                success = await register(
                    name,
                    email,
                    password,
                    phone,
                    isOwner ? "owner" : "user"
                );
            }

            if (success) {
                resetForm();
                setAuthModalOpen(false);
            }
        } catch (error) {
            console.error("Authentication failed:", error);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={handleClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    onClick={handleClose}
                    className="auth-close-button"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="auth-tabs">
                    <button
                        type="button"
                        onClick={() => setIsLoginTab(true)}
                        className={`auth-tab ${
                            isLoginTab ? "active" : ""
                        }`}
                    >
                        SIGN IN
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsLoginTab(false)}
                        className={`auth-tab ${
                            !isLoginTab ? "active" : ""
                        }`}
                    >
                        SIGN UP
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <div className="auth-heading">
                            <h2>Welcome to DineSync</h2>
                            <p>
                                Access your exclusive reservations and
                                curated dining profile.
                            </p>
                        </div>

                        <div className="auth-fields">
                            {!isLoginTab && (
                                <div className="auth-field">
                                    <label htmlFor="auth-name">
                                        FULL NAME
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            <User size={16} />
                                        </span>

                                        <input
                                            id="auth-name"
                                            type="text"
                                            required={!isLoginTab}
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="auth-email">
                                    EMAIL ADDRESS
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Mail size={16} />
                                    </span>

                                    <input
                                        id="auth-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {!isLoginTab && (
                                <div className="auth-field">
                                    <label htmlFor="auth-phone">
                                        PHONE NUMBER (OPTIONAL)
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <span className="auth-input-icon">
                                            <Phone size={16} />
                                        </span>

                                        <input
                                            id="auth-phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="auth-password">
                                    PASSWORD
                                </label>

                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Lock size={16} />
                                    </span>

                                    <input
                                        id="auth-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            {!isLoginTab && (
                                <div className="auth-owner-option">
                                    <input
                                        type="checkbox"
                                        id="isOwner"
                                        checked={isOwner}
                                        onChange={(e) =>
                                            setIsOwner(e.target.checked)
                                        }
                                    />

                                    <label htmlFor="isOwner">
                                        I am a Restaurant Owner / Manager
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="auth-submit-section">
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="auth-submit-button"
                        >
                            {formLoading
                                ? "PROCESSING..."
                                : isLoginTab
                                    ? "LOGIN"
                                    : "CREATE ACCOUNT"}
                        </button>

                        <p className="auth-terms">
                            By signing in, you agree to our{" "}
                            <a href="#">
                                Terms of Service
                            </a>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}