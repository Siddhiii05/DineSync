import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Hero from "../components/home/Hero.jsx";
import CuisineBrowse from "../components/home/CuisineBrowse.jsx";
import TrendingRow from "../components/home/TrendingRow.jsx";
import MembershipSection from "../components/home/MembershipSection.jsx";
import NewsletterCTA from "../components/home/NewsletterCTA.jsx";
import { dummyFeaturedRestaurants } from "../assets/assets.js";
import "../styles/Home.css";

export default function Home() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            setTrending(dummyFeaturedRestaurants);
            setLoading(false);
        };
        fetchTrending();
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            <AuthModal />
            <main className="home-main">
                <Hero />
                <CuisineBrowse />
                <TrendingRow
                    trending={trending}
                    loading={loading}
                />
                <MembershipSection />
                <NewsletterCTA />
            </main>
            <Footer />
        </div>
    );
}