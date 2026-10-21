import { Info } from "lucide-react";
import "../../styles/PendingApproval.css";

export default function PendingApproval({ restaurant }) {
    return (
        <div className="pending-approval">

            <Info size={40} className="pending-icon" />

            <h2 className="pending-title">
                Registration Pending Approval
            </h2>

            <p className="pending-description">
                Thank you for registering{" "}
                <span className="pending-restaurant-name">
                    {restaurant?.name}
                </span>
                . Your profile details and slots listing are
                currently under review by our Master Admin.
            </p>

            <div className="pending-details">

                <p>
                    <strong>Cuisine:</strong>{" "}
                    {restaurant?.cuisine}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {restaurant?.location}
                </p>

                <p>
                    <strong>Capacity:</strong>{" "}
                    {restaurant?.totalSeats} seats
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    <span className="pending-status-badge">
                        PENDING
                    </span>
                </p>

            </div>

            <p className="pending-note">
                You will receive full booking access as soon as
                your restaurant status is marked as APPROVED.
            </p>

        </div>
    );
}