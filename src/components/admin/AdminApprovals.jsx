import { Link } from "react-router-dom";
import { CheckCircle, Utensils, MapPin, Users } from "lucide-react";
import "../../styles/AdminApprovals.css";

export default function AdminApprovals({
  pendingRestaurants,
  otherRestaurants,
  btnLoading,
  onApproveStatus,
}) {
  return (
    <div className="admin-approvals">
      {/* Section A: Pending Approvals */}
      <section className="admin-approval-section">
        <h3 className="admin-section-title">
          Pending Registration Requests ({pendingRestaurants.length})
        </h3>

        {pendingRestaurants.length === 0 ? (
          <div className="admin-empty-state">
            <CheckCircle size={32} className="admin-success-icon" />
            <p>All restaurant registrations have been processed.</p>
          </div>
        ) : (
          <div className="admin-pending-list">
            {pendingRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="admin-pending-card"
              >
                <div className="admin-restaurant-details">
                  <h4>{restaurant.name}</h4>

                  <p className="admin-restaurant-description">
                    {restaurant.description}
                  </p>

                  <div className="admin-restaurant-meta">
                    <span>
                      <Utensils size={12} />
                      {restaurant.cuisine}
                    </span>

                    <span>
                      <MapPin size={12} />
                      {restaurant.address}
                    </span>

                    <span>
                      <Users size={12} />
                      Capacity: {restaurant.totalSeats} seats
                    </span>
                  </div>

                  <p className="admin-owner-details">
                    Owner: {restaurant.owner?.name} (
                    {restaurant.owner?.email})
                  </p>
                </div>

                <div className="admin-approval-actions">
                  <button
                    disabled={btnLoading === restaurant._id}
                    onClick={() =>
                      onApproveStatus(restaurant._id, "approved")
                    }
                    className="admin-action-button admin-approve-button"
                  >
                    Approve
                  </button>

                  <button
                    disabled={btnLoading === restaurant._id}
                    onClick={() =>
                      onApproveStatus(restaurant._id, "rejected")
                    }
                    className="admin-action-button admin-reject-button"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section B: Existing Restaurant Partners */}
      <section className="admin-approval-section">
        <h3 className="admin-section-title">
          Registered Establishments ({otherRestaurants.length})
        </h3>

        {otherRestaurants.length === 0 ? (
          <p className="admin-no-records">
            No approved or rejected restaurant records.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-restaurant-table">
              <thead>
                <tr>
                  <th>Establishment</th>
                  <th>Cuisine &amp; City</th>
                  <th>Owner Account</th>
                  <th className="admin-status-heading">
                    Status / Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {otherRestaurants.map((restaurant) => (
                  <tr key={restaurant._id}>
                    <td className="admin-establishment-name">
                      <Link to={`/restaurant/${restaurant.slug}`}>
                        {restaurant.name}
                      </Link>
                    </td>

                    <td>
                      {restaurant.cuisine} • {restaurant.location}
                    </td>

                    <td className="admin-owner-name">
                      {restaurant.owner?.name || "N/A"}
                    </td>

                    <td className="admin-status-cell">
                      <span
                        className={`admin-status-badge ${
                          restaurant.status === "approved"
                            ? "admin-status-approved"
                            : "admin-status-rejected"
                        }`}
                      >
                        {restaurant.status}
                      </span>

                      {restaurant.status === "approved" ? (
                        <button
                          onClick={() =>
                            onApproveStatus(
                              restaurant._id,
                              "rejected"
                            )
                          }
                          className="admin-table-action admin-suspend-button"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onApproveStatus(
                              restaurant._id,
                              "approved"
                            )
                          }
                          className="admin-table-action admin-reapprove-button"
                        >
                          Re-Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}