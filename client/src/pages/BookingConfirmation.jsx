import { useState, useEffect } from "react";
import {useParams,useSearchParams,useNavigate,Link} from "react-router-dom";
import api from "../lib/api.js";
import { useAppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import BookingSuccess from "../components/booking/BookingSuccess.jsx";
import BookingSummary from "../components/booking/BookingSummary.jsx";
import BookingForm from "../components/booking/BookingForm.jsx";
import "../styles/BookingConfirmation.css";

export default function BookingConfirmation() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();

    const { user } = useAppContext();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    // Form inputs
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [occasion, setOccasion] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    // Booking details from URL query parameters
    const slot = searchParams.get("slot") || "";
    const date = searchParams.get("date") || "";
    const guests = searchParams.get("guests") || "2";

    // Prefill form when user details become available
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);

            if (user.phone) {
                setPhone(user.phone);
            }
        }
    }, [user]);

    // Fetch restaurant details
    useEffect(() => {
        const fetchRestaurant = async () => {
            try{
                setLoading(true);
                const res = await api.get(`/restaurants/${slug}`);
                setRestaurant(res.data)
            }
            catch(error){
                toast.error(error?.response?.data?.message || error?.message);
                navigate('/')
            }
            finally{
                setLoading(false);
            }
        };

        if (slug) {
            fetchRestaurant();
        } else {
            setRestaurant(null);
            setLoading(false);
        }
    }, [slug]);

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();

        if (!slot || !date) {
            toast.error( "Reservation details are missing. Return to restaurant details.");
            return;
        }

        try {
            setConfirming(true);

            const res = await api.post(`/bookings`, {restaurantId: restaurant._id, date, time: slot, guests, occasion, specialRequests});
            setConfirmedBooking(res.data)

            toast.success("Reservation confirmed!");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setConfirming(false);
        }
    };

    // Show loader while restaurant details are loading
    if (loading) {
        return <Loader text="Retrieving Dining Details..." />;
    }

    // Handle an invalid restaurant slug
    if (!restaurant) {
        return (
            <div className="booking-page">
                <Navbar />

                <main className="booking-not-found">
                    <h2>Restaurant Not Found</h2>

                    <p>
                        We couldn't find the restaurant you're looking for.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/search")}
                    >
                        Explore Restaurants
                    </button>
                </main>

                <Footer />
            </div>
        );
    }

    // Display the success screen after confirmation
    if (confirmedBooking) {
        return (
            <div className="booking-page">
                <Navbar />

                <main className="booking-success-main">
                    <BookingSuccess
                        confirmedBooking={confirmedBooking}
                        restaurant={restaurant}
                        date={date}
                        slot={slot}
                        guests={guests}
                    />
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="booking-page">
            <Navbar />

            {/* Main Booking Content */}
            <main className="booking-main">
                {/* Progress Header */}
                <div className="booking-breadcrumb">
                    <Link
                        to={`/restaurant/${restaurant.slug}`}
                        className="booking-breadcrumb-link"
                    >
                        {restaurant.name}
                    </Link>

                    <ChevronRight size={14} />

                    <span className="booking-breadcrumb-current">
                        Details &amp; Confirmation
                    </span>
                </div>

                <div className="booking-content-grid">
                    {/* Reservation Summary */}
                    <div className="booking-summary-column">
                        <BookingSummary
                            restaurant={restaurant}
                            date={date}
                            slot={slot}
                            guests={guests}
                        />
                    </div>

                    {/* Guest Details Form */}
                    <div className="booking-form-column">
                        <BookingForm
                            name={name}
                            setName={setName}
                            email={email}
                            setEmail={setEmail}
                            phone={phone}
                            setPhone={setPhone}
                            occasion={occasion}
                            setOccasion={setOccasion}
                            specialRequests={specialRequests}
                            setSpecialRequests={setSpecialRequests}
                            confirming={confirming}
                            onSubmit={handleConfirmSubmit}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}