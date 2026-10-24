import { useState } from "react";
import { Utensils, Upload, Image } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";
import "../../styles/RestaurantWizard.css";

export default function RestaurantWizard({ setRestaurant }) {
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

    const [availableSlots, setAvailableSlots] = useState([
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
    ]);

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

    // Select or deselect a reservation slot
    const toggleSlot = (slot) => {
        setAvailableSlots((previousSlots) =>
            previousSlots.includes(slot)
                ? previousSlots.filter((item) => item !== slot)
                : [...previousSlots, slot].sort()
        );
    };

    // Select and preview the restaurant image
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // Submit the restaurant registration form
    const handleCreateRestaurant = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please select a restaurant cover image.");
            return;
        }

        if (availableSlots.length === 0) {
            toast.error("Please select at least one available time slot.");
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
            formData.append("totalSeats", String(totalSeats));
            formData.append("image", imageFile);

            // Debug: verify the data being submitted
            console.log("Submitting restaurant form:");
            for (const [key, value] of formData.entries()) {
                console.log(
                     key,
                     value instanceof File
                         ? `${value.name} (${value.type}, ${value.size} bytes)`
                         : value
                 );
             }

            // Do not manually set Content-Type.
            // Axios will handle FormData and its multipart boundary.
            const response = await api.post(
                "/owner/restaurant",
                formData, 
                {headers:{
                    "Content-Type": "multipart/form-data"
                }}
            );

            setRestaurant(response.data.restaurant);

            toast.success(
                "Restaurant profile submitted successfully! Awaiting Admin approval."
            );
        } catch (error) {
            console.error(
                "Restaurant registration failed:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to register restaurant. Please try again."
            );
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="restaurant-wizard">
            <div className="wizard-header">
                <Utensils
                    size={36}
                    className="wizard-header-icon"
                />

                <h2 className="wizard-title">
                    Setup Restaurant Profile
                </h2>

                <p className="wizard-description">
                    Please create your restaurant details. Once submitted,
                    it will be pending approval from the admin.
                </p>
            </div>

            <form
                onSubmit={handleCreateRestaurant}
                className="wizard-form"
            >
                {/* Restaurant name and cuisine */}
                <div className="wizard-grid wizard-grid-2">
                    <div className="wizard-field">
                        <label htmlFor="restaurant-name">
                            Restaurant Name
                        </label>

                        <input
                            id="restaurant-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. L'Artiste"
                        />
                    </div>

                    <div className="wizard-field">
                        <label htmlFor="restaurant-cuisine">
                            Cuisine Type
                        </label>

                        <input
                            id="restaurant-cuisine"
                            type="text"
                            required
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            placeholder="e.g. French, Omakase"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="wizard-field">
                    <label htmlFor="restaurant-description">
                        Description
                    </label>

                    <textarea
                        id="restaurant-description"
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the dining experience, atmosphere, and dining philosophy..."
                    />
                </div>

                {/* Restaurant image */}
                <div className="wizard-field">
                    <label>Restaurant Cover Image</label>

                    <div className="wizard-image-upload">
                        <div className="wizard-image-preview">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Restaurant preview"
                                />
                            ) : (
                                <Image
                                    size={24}
                                    className="wizard-placeholder-icon"
                                />
                            )}
                        </div>

                        <div className="wizard-image-controls">
                            <p>
                                Upload a restaurant cover photo.
                                JPG and PNG images up to 5 MB are supported.
                            </p>

                            <label className="wizard-upload-button">
                                <Upload size={12} />

                                {imageFile ? "Change Image" : "Upload Image"}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    required={!imageFile}
                                    onChange={handleImageChange}
                                />
                            </label>

                            {imageFile && (
                                <span className="wizard-selected-file">
                                    Selected: {imageFile.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price, location and capacity */}
                <div className="wizard-grid wizard-grid-3">
                    <div className="wizard-field">
                        <label htmlFor="restaurant-price">
                            Price Range
                        </label>

                        <select
                            id="restaurant-price"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        >
                            <option value="$">$ (Casual)</option>
                            <option value="$$">$$ (Moderate)</option>
                            <option value="$$$">$$$ (Upscale)</option>
                            <option value="$$$$">$$$$ (Fine Dining)</option>
                        </select>
                    </div>

                    <div className="wizard-field">
                        <label htmlFor="restaurant-location">
                            Location (City)
                        </label>

                        <input
                            id="restaurant-location"
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Mumbai"
                        />
                    </div>

                    <div className="wizard-field">
                        <label htmlFor="restaurant-seats">
                            Total Capacity (Seats)
                        </label>

                        <input
                            id="restaurant-seats"
                            type="number"
                            min="1"
                            required
                            value={totalSeats}
                            onChange={(e) => setTotalSeats(e.target.value)}
                        />
                    </div>
                </div>

                {/* Address and chef */}
                <div className="wizard-grid wizard-grid-2">
                    <div className="wizard-field">
                        <label htmlFor="restaurant-address">
                            Address
                        </label>

                        <input
                            id="restaurant-address"
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Restaurant street address"
                        />
                    </div>

                    <div className="wizard-field">
                        <label htmlFor="restaurant-chef">
                            Executive Chef
                        </label>

                        <input
                            id="restaurant-chef"
                            type="text"
                            required
                            value={chef}
                            onChange={(e) => setChef(e.target.value)}
                            placeholder="Chef name"
                        />
                    </div>
                </div>

                {/* Restaurant tags */}
                <div className="wizard-field">
                    <label htmlFor="restaurant-tags">
                        Tags (comma separated)
                    </label>

                    <input
                        id="restaurant-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Michelin Star, Romantic, Rooftop"
                    />
                </div>

                {/* Available reservation slots */}
                <div className="wizard-field">
                    <label>Available Slots</label>

                    <div className="wizard-slots">
                        {defaultSlots.map((slot) => {
                            const isSelected = availableSlots.includes(slot);

                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => toggleSlot(slot)}
                                    className={`wizard-slot ${
                                        isSelected
                                            ? "wizard-slot-selected"
                                            : ""
                                    }`}
                                    aria-pressed={isSelected}
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
                    className="wizard-submit-button"
                >
                    {formLoading
                        ? "SUBMITTING..."
                        : "REGISTER RESTAURANT"}
                </button>
            </form>
        </div>
    );
}
