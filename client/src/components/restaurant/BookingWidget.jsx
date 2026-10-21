import { Calendar, Users } from "lucide-react";
import "../../styles/BookingWidget.css";

export default function BookingWidget({
    restaurant,
    selectedDate,
    setSelectedDate,
    selectedGuests,
    setSelectedGuests,
    selectedSlot,
    setSelectedSlot,
    slotsAvailability,
    loadingSlots,
    isAuthenticated,
    handleReserveClick,
}) {
    if (!restaurant) return null;

    const todayStr = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === todayStr;

    const allSlots =
        slotsAvailability.length > 0
            ? slotsAvailability
            : (restaurant.availableSlots || []).map((time) => ({
                  time,
                  availableSeats: 20,
                  isAvailable: true,
              }));

    const filteredSlots = allSlots.filter((slotInfo) => {
        if (!isToday) return true;

        const [slotHour, slotMinute] = slotInfo.time
            .split(":")
            .map(Number);

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        return (
            slotHour > currentHour ||
            (slotHour === currentHour && slotMinute > currentMinute)
        );
    });

    return (
        <div className="booking-widget">
            <h3 className="booking-widget-title">
                Book a Table
            </h3>

            <div className="booking-widget-content">
                {/* Guests count */}
                <div className="booking-field">
                    <label
                        className="booking-label"
                        htmlFor="booking-guests"
                    >
                        PARTY SIZE
                    </label>

                    <div className="booking-input-wrapper">
                        <Users
                            className="booking-input-icon"
                            size={16}
                        />

                        <select
                            id="booking-guests"
                            value={selectedGuests}
                            onChange={(e) =>
                                setSelectedGuests(e.target.value)
                            }
                            className="booking-input booking-select"
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="6">6 Guests</option>
                            <option value="8">8 Guests</option>
                        </select>
                    </div>
                </div>

                {/* Date */}
                <div className="booking-field">
                    <label
                        className="booking-label"
                        htmlFor="booking-date"
                    >
                        DATE
                    </label>

                    <div className="booking-input-wrapper">
                        <Calendar
                            className="booking-input-icon"
                            size={16}
                        />

                        <input
                            id="booking-date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) =>
                                setSelectedDate(e.target.value)
                            }
                            min={todayStr}
                            className="booking-input booking-date-input"
                        />
                    </div>
                </div>

                {/* Time slots */}
                <div className="booking-time-section">
                    <span className="booking-label">
                        AVAILABLE TIMES
                    </span>

                    <div className="booking-slots-grid">
                        {loadingSlots ? (
                            <div className="booking-slots-loading">
                                <div className="booking-spinner"></div>
                            </div>
                        ) : filteredSlots.length === 0 ? (
                            <p className="booking-no-slots">
                                No available times for this date.
                            </p>
                        ) : (
                            filteredSlots.map((slotInfo) => {
                                const slot = slotInfo.time;

                                const isSelected =
                                    selectedSlot === slot;

                                const isFull =
                                    !slotInfo.isAvailable ||
                                    slotInfo.availableSeats <
                                        Number(selectedGuests);

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        disabled={isFull}
                                        onClick={() =>
                                            setSelectedSlot(slot)
                                        }
                                        className={`booking-slot ${
                                            isSelected
                                                ? "booking-slot-selected"
                                                : isFull
                                                  ? "booking-slot-full"
                                                  : "booking-slot-available"
                                        }`}
                                    >
                                        {slot}

                                        {isFull && (
                                            <span className="booking-slot-full-label">
                                                Full
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Reservation button */}
                <button
                    type="button"
                    onClick={handleReserveClick}
                    className="booking-reserve-button"
                >
                    {isAuthenticated
                        ? "RESERVE NOW"
                        : "LOGIN TO RESERVE"}
                </button>

                <p className="booking-policy">
                    No reservation fee. Cancel for free up to 24 hours
                    prior.
                </p>
            </div>
        </div>
    );
}