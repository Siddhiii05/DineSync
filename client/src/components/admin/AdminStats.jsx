import { Users, ShieldCheck, Utensils, Calendar } from "lucide-react";
import "../../styles/AdminStats.css";

export default function AdminStats({ stats }) {
  if (!stats) return null;

  const kpiCards = [
    {
      title: "Active Diners",
      value: stats.users?.totalUsers ?? 0,
      icon: Users,
    },
    {
      title: "Partners",
      value: stats.users?.totalOwners ?? 0,
      icon: ShieldCheck,
    },
    {
      title: "Total Venues",
      value: stats.restaurants?.total ?? 0,
      icon: Utensils,
    },
    {
      title: "Bookings",
      value: stats.bookings?.total ?? 0,
      icon: Calendar,
    },
  ];

  return (
    <div className="admin-stats">
      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        {kpiCards.map(({ title, value, icon: Icon }) => (
          <div className="admin-kpi-card" key={title}>
            <span className="admin-kpi-label">
              <Icon size={12} className="admin-kpi-icon" />
              {title}
            </span>

            <h4 className="admin-kpi-value">{value}</h4>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <section className="admin-recent-bookings">
        <h3 className="admin-stats-heading">
          Recent Bookings Activity
        </h3>

        {!stats.latestBookings ||
        stats.latestBookings.length === 0 ? (
          <p className="admin-bookings-empty">
            No bookings recorded on the platform.
          </p>
        ) : (
          <div className="admin-stats-table-wrapper">
            <table className="admin-stats-table">
              <thead>
                <tr>
                  {[
                    "Ref Code",
                    "Diner",
                    "Restaurant",
                    "Details",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className={
                        header === "Status"
                          ? "admin-stats-status-heading"
                          : ""
                      }
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {stats.latestBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="admin-booking-reference">
                      {booking.bookingId}
                    </td>

                    <td>
                      <div className="admin-booking-user">
                        {booking.user?.name || "N/A"}
                      </div>
                      <div className="admin-booking-email">
                        {booking.user?.email || ""}
                      </div>
                    </td>

                    <td className="admin-booking-restaurant">
                      {booking.restaurant?.name ||
                        "Deleted Restaurant"}
                    </td>

                    <td className="admin-booking-details">
                      {booking.date
                        ? new Date(
                            booking.date
                          ).toLocaleDateString()
                        : "N/A"}{" "}
                      at {booking.time} • {booking.guests} Guests
                    </td>

                    <td className="admin-booking-status-cell">
                      <span
                        className={`admin-booking-status ${
                          booking.status === "confirmed"
                            ? "status-confirmed"
                            : booking.status === "completed"
                              ? "status-completed"
                              : "status-other"
                        }`}
                      >
                        {booking.status}
                      </span>
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