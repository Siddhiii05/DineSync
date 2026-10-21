import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
                <Route 
                    path="/booking/:slug" 
                    element={
                        <ProtectedRoute>
                            <BookingConfirmation />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/owner/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["owner"]}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </>
    );
}

