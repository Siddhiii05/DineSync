import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Image } from "lucide-react";
import { dummyRestaurant } from "../../assets/assets.js";
import "../../styles/OwnerProfileDetails.css";

export default function OwnerProfileDetails({
  restaurant,
  setRestaurant,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [priceRange, setPriceRange] = useState("$$");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [chef, setChef] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalSeats, setTotalSeats] = useState("20");
  const [formLoading, setFormLoading] = useState(false);

  const defaultSlots = [
    "12:00",
    "13:00",
    "14:00",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];

  // Load the restaurant details into the form.
  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || "");
      setDescription(restaurant.description || "");
      setCuisine(restaurant.cuisine || "");
      setPriceRange(restaurant.priceRange || "$$");
      setLocation(restaurant.location || "");
      setAddress(restaurant.address || "");
      setChef(restaurant.chef || "");
      setTags(restaurant.tags?.join(", ") || "");
      setTotalSeats(restaurant.totalSeats?.toString() || "20");
      setAvailableSlots(restaurant.availableSlots || []);
      setImagePreview(restaurant.image || "");
      setImageFile(null);
    }
  }, [restaurant]);

  // Select or deselect an available time slot.
  const toggleSlot = (slot) => {
    if (availableSlots.includes(slot)) {
      setAvailableSlots(
        availableSlots.filter((s) => s !== slot)
      );
    } else {
      setAvailableSlots(
        [...availableSlots, slot].sort()
      );
    }
  };

  // Handle restaurant cover image selection.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission.
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("cuisine", cuisine);
      formData.append("priceRange", priceRange);
      formData.append("location", location);
      formData.append("address", address);
      formData.append("chef", chef);
      formData.append("tags", tags);
      formData.append(
        "availableSlots",
        availableSlots.join(",")
      );
      formData.append("totalSeats", totalSeats);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Temporary mock update.
      // This does not save the form data to MongoDB.
      setRestaurant({
        ...dummyRestaurant[0],
        name,
        description,
        cuisine,
        priceRange,
        location,
        address,
        chef,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        totalSeats: Number(totalSeats),
        availableSlots,
        image: imagePreview,
      });

      toast.success(
        "Profile details updated successfully!"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Update failed"
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="owner-profile">
      <h3 className="owner-profile-heading">
        Update Profile &amp; Capacity
      </h3>

      <form
        onSubmit={handleUpdateRestaurant}
        className="owner-profile-form"
      >
        {/* Restaurant name and cuisine */}
        <div className="owner-profile-grid owner-profile-grid-2">
          <div className="owner-profile-field">
            <label>Restaurant Name</label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="owner-profile-field">
            <label>Cuisine Type</label>

            <input
              type="text"
              required
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="owner-profile-field">
          <label>Description</label>

          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* Cover image */}
        <div className="owner-profile-field">
          <label>Restaurant Cover Image</label>

          <div className="owner-profile-image-upload">
            <div className="owner-profile-image-preview">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Restaurant cover preview"
                />
              ) : (
                <Image size={24} />
              )}
            </div>

            <div className="owner-profile-upload-content">
              <p>
                Upload a high-resolution banner photo for
                your restaurant page. Supports JPG and PNG.
              </p>

              <label className="owner-profile-upload-button">
                <Upload size={12} />

                {imageFile
                  ? "Change Image"
                  : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              {imageFile && (
                <span className="owner-profile-selected-file">
                  Selected: {imageFile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price range, location and seating capacity */}
        <div className="owner-profile-grid owner-profile-grid-3">
          <div className="owner-profile-field">
            <label>Price Range</label>

            <select
              value={priceRange}
              onChange={(e) =>
                setPriceRange(e.target.value)
              }
            >
              <option value="$">$ (Casual)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Upscale)</option>
              <option value="$$$$">
                $$$$ (Fine Dining)
              </option>
            </select>
          </div>

          <div className="owner-profile-field">
            <label>Location (City)</label>

            <input
              type="text"
              required
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <div className="owner-profile-field">
            <label>Total Capacity (Seats)</label>

            <input
              type="number"
              min="1"
              required
              value={totalSeats}
              onChange={(e) =>
                setTotalSeats(e.target.value)
              }
            />
          </div>
        </div>

        {/* Address and chef */}
        <div className="owner-profile-grid owner-profile-grid-2">
          <div className="owner-profile-field">
            <label>Address</label>

            <input
              type="text"
              required
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />
          </div>

          <div className="owner-profile-field">
            <label>Executive Chef</label>

            <input
              type="text"
              required
              value={chef}
              onChange={(e) => setChef(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="owner-profile-field">
          <label>Tags (comma separated)</label>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Available booking slots */}
        <div className="owner-profile-slots">
          <label>Available Slots</label>

          <div className="owner-profile-slot-list">
            {defaultSlots.map((slot) => {
              const isSelected =
                availableSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`owner-profile-slot ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formLoading}
          className="owner-profile-submit"
        >
          {formLoading
            ? "SAVING CHANGES..."
            : "SAVE PROFILE DETAILS"}
        </button>
      </form>
    </div>
  );
}