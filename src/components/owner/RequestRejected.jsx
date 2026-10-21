import { XIcon } from "lucide-react";
import "../../styles/RequestRejected.css";

export default function RequestRejected({ restaurantName }) {
    return (
        <div className="request-rejected">

            <XIcon
                size={40}
                className="rejected-icon"
            />

            <h2 className="rejected-title">
                Registration Denied
            </h2>

            <p className="rejected-description">
                Unfortunately, your request to list{" "}
                <strong>{restaurantName}</strong> has been rejected
                by our administration team.
            </p>

            <p className="rejected-note">
                Please contact customer support for further information.
            </p>

        </div>
    );
}