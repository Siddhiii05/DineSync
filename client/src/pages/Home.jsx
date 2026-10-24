import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Hero from "../components/home/Hero.jsx";
import CuisineBrowse from "../components/home/CuisineBrowse.jsx";
import TrendingRow from "../components/home/TrendingRow.jsx";
import MembershipSection from "../components/home/MembershipSection.jsx";
import "../styles/Home.css";
import toast from "react-hot-toast";
import api from "../lib/api"

export default function Home() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try{
                const res = await api.get('/restaurants/featured')
                setTrending(res.data)
            }
            catch(error){
                toast.error(error?.response?.data?.message || error?.message)
            }
            finally{
                setLoading(false)
            }
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
            </main>
            <Footer />
        </div>
    );
}