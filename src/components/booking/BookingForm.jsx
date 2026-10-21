import "../../styles/BookingForm.css";

export default function BookingForm({
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    occasion,
    setOccasion,
    specialRequests,
    setSpecialRequests,
    confirming,
    onSubmit,
}) {
    return (
        <div className="booking-form-card">
            <h3 className="booking-form-title">
                Guest Details
            </h3>

            <form onSubmit={onSubmit} className="booking-form">
                {/* Name and Email */}
                <div className="booking-form-grid">
                    <div className="booking-form-field">
                        <label htmlFor="booking-name">
                            FULL NAME
                        </label>

                        <input
                            id="booking-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="booking-form-input"
                            required
                        />
                    </div>

                    <div className="booking-form-field">
                        <label htmlFor="booking-email">
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="booking-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="booking-form-input"
                            required
                        />
                    </div>
                </div>

                {/* Phone and Occasion */}
                <div className="booking-form-grid">
                    <div className="booking-form-field">
                        <label htmlFor="booking-phone">
                            PHONE NUMBER
                        </label>

                        <input
                            id="booking-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="booking-form-input"
                            required
                        />
                    </div>

                    <div className="booking-form-field">
                        <label htmlFor="booking-occasion">
                            SPECIAL OCCASION
                        </label>

                        <select
                            id="booking-occasion"
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            className="booking-form-input booking-form-select"
                        >
                            <option value="">None</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Anniversary">Anniversary</option>
                            <option value="Date Night">Date Night</option>
                            <option value="Business Dining">
                                Business Dining
                            </option>
                        </select>
                    </div>
                </div>

                {/* Special Requests */}
                <div className="booking-form-field booking-form-requests">
                    <label htmlFor="booking-requests">
                        SPECIAL REQUESTS (OPTIONAL)
                    </label>

                    <textarea
                        id="booking-requests"
                        value={specialRequests}
                        onChange={(e) =>
                            setSpecialRequests(e.target.value)
                        }
                        rows={3}
                        placeholder="Allergies, dietary restrictions, table preference..."
                        className="booking-form-textarea"
                    />
                </div>

                {/* Newsletter Checkbox */}
                <div className="booking-form-newsletter">
                    <input
                        type="checkbox"
                        id="newsletterOpt"
                        className="booking-form-checkbox"
                        defaultChecked
                    />

                    <label htmlFor="newsletterOpt">
                        Send me seasonal tasting menu invitations and
                        private chef event notifications from DineSync.
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={confirming}
                    className="booking-form-submit"
                >
                    {confirming
                        ? "CONFIRMING TABLE..."
                        : "BOOK TABLE"}
                </button>
            </form>
        </div>
    );
}