import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Image } from "lucide-react";
import api from "../../lib/api.js";
import "../../styles/OwnerProfileDetails.css";

export default function OwnerProfileDetails({ restaurant, setRestaurant }) {
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

  // Populate the form when restaurant details are available.
  useEffect(() => {
    if (!restaurant) return;

    setName(restaurant.name || "");
    setDescription(restaurant.description || "");
    setCuisine(restaurant.cuisine || "");
    setPriceRange(restaurant.priceRange || "$$");
    setLocation(restaurant.location || "");
    setAddress(restaurant.address || "");
    setChef(restaurant.chef || "");
    setTags(Array.isArray(restaurant.tags) ? restaurant.tags.join(", ") : "");
    setTotalSeats(String(restaurant.totalSeats ?? 20));
    setAvailableSlots(
      Array.isArray(restaurant.availableSlots) ? restaurant.availableSlots : [],
    );
    setImagePreview(restaurant.image || "");
    setImageFile(null);
  }, [restaurant]);

  // Select or deselect a booking slot.
  const toggleSlot = (slot) => {
    setAvailableSlots((previousSlots) =>
      previousSlots.includes(slot)
        ? previousSlots.filter((item) => item !== slot)
        : [...previousSlots, slot].sort(),
    );
  };

  // Handle cover image selection.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview((previousPreview) => {
      if (previousPreview.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return previewUrl;
    });
  };

  // Submit updated restaurant details.
  const handleUpdateRestaurant = async (event) => {
    event.preventDefault();

    if (!restaurant?._id) {
      toast.error("Restaurant information is missing.");
      return;
    }

    const seats = Number(totalSeats);

    if (!Number.isInteger(seats) || seats < 1) {
      toast.error("Total capacity must be a positive whole number.");
      return;
    }

    setFormLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("cuisine", cuisine.trim());
      formData.append("priceRange", priceRange);
      formData.append("location", location.trim());
      formData.append("address", address.trim());
      formData.append("chef", chef.trim());
      formData.append("tags", tags);
      formData.append("availableSlots", availableSlots.join(","));
      formData.append("totalSeats", String(seats));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.put("/owner/restaurant", formData);

      // The backend returns { success, message, restaurant }.
      const updatedRestaurant = response.data?.restaurant;

      if (!updatedRestaurant?._id) {
        throw new Error("The server did not return the updated restaurant.");
      }

      setRestaurant(updatedRestaurant);
      setImageFile(null);

      toast.success(
        response.data.message || "Profile details updated successfully!",
      );
    } catch (error) {
      console.error("UPDATE RESTAURANT ERROR:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update restaurant profile.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Clean up temporary image preview URLs.
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="owner-profile">
      <h3 className="owner-profile-heading">Update Profile &amp; Capacity</h3>

      <form onSubmit={handleUpdateRestaurant} className="owner-profile-form">
        <div className="owner-profile-grid owner-profile-grid-2">
          <div className="owner-profile-field">
            <label htmlFor="restaurant-name">Restaurant Name</label>
            <input
              id="restaurant-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="owner-profile-field">
            <label htmlFor="restaurant-cuisine">Cuisine Type</label>
            <input
              id="restaurant-cuisine"
              type="text"
              required
              value={cuisine}
              onChange={(event) => setCuisine(event.target.value)}
            />
          </div>
        </div>

        <div className="owner-profile-field">
          <label htmlFor="restaurant-description">Description</label>
          <textarea
            id="restaurant-description"
            required
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="owner-profile-field">
          <label htmlFor="restaurant-image">Restaurant Cover Image</label>

          <div className="owner-profile-image-upload">
            <div className="owner-profile-image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Restaurant cover" />
              ) : (
                <Image size={24} />
              )}
            </div>

            <div className="owner-profile-upload-content">
              <p>
                Upload a high-resolution restaurant image. JPG and PNG are
                recommended. Maximum size: 5 MB.
              </p>

              <label
                htmlFor="restaurant-image"
                className="owner-profile-upload-button"
              >
                <Upload size={12} />
                {imageFile ? "Change Image" : "Upload Image"}
              </label>

              <input
                id="restaurant-image"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              {imageFile && (
                <span className="owner-profile-selected-file">
                  Selected: {imageFile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="owner-profile-grid owner-profile-grid-3">
          <div className="owner-profile-field">
            <label htmlFor="restaurant-price">Price Range</label>
            <select
              id="restaurant-price"
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
            >
              <option value="$">$ (Casual)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Upscale)</option>
              <option value="$$$$">$$$$ (Fine Dining)</option>
            </select>
          </div>

          <div className="owner-profile-field">
            <label htmlFor="restaurant-location">Location (City)</label>
            <input
              id="restaurant-location"
              type="text"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="owner-profile-field">
            <label htmlFor="restaurant-seats">Total Capacity (Seats)</label>
            <input
              id="restaurant-seats"
              type="number"
              min="1"
              step="1"
              required
              value={totalSeats}
              onChange={(event) => setTotalSeats(event.target.value)}
            />
          </div>
        </div>

        <div className="owner-profile-grid owner-profile-grid-2">
          <div className="owner-profile-field">
            <label htmlFor="restaurant-address">Address</label>
            <input
              id="restaurant-address"
              type="text"
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>

          <div className="owner-profile-field">
            <label htmlFor="restaurant-chef">Executive Chef</label>
            <input
              id="restaurant-chef"
              type="text"
              required
              value={chef}
              onChange={(event) => setChef(event.target.value)}
            />
          </div>
        </div>

        <div className="owner-profile-field">
          <label htmlFor="restaurant-tags">Tags (comma separated)</label>
          <input
            id="restaurant-tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <div className="owner-profile-slots">
          <label>Available Slots</label>

          <div className="owner-profile-slot-list">
            {defaultSlots.map((slot) => {
              const isSelected = availableSlots.includes(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={isSelected}
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

        <button
          type="submit"
          disabled={formLoading}
          className="owner-profile-submit"
        >
          {formLoading ? "SAVING CHANGES..." : "SAVE PROFILE DETAILS"}
        </button>
      </form>
    </div>
  );
}
