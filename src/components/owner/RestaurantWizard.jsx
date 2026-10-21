import { useState } from "react";
import { Utensils, Upload, Image } from "lucide-react";
import toast from "react-hot-toast";
import { dummyRestaurant } from "../../assets/assets.js";

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
        if (availableSlots.includes(slot)) {
            setAvailableSlots(
                availableSlots.filter((item) => item !== slot)
            );
        } else {
            setAvailableSlots(
                [...availableSlots, slot].sort()
            );
        }
    };

    // Preview the selected cover image
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle restaurant registration
    const handleCreateRestaurant = async (e) => {
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

            // Demonstration only: uses sample restaurant data
            setRestaurant(dummyRestaurant[0]);

            toast.success(
                "Restaurant profile submitted successfully! Awaiting Admin approval."
            );
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to register restaurant"
            );
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="restaurant-wizard">

            {/* Heading */}
            <div className="wizard-header">
                <Utensils
                    size={36}
                    className="wizard-header-icon"
                />

                <h2 className="wizard-title">
                    Setup Restaurant Profile
                </h2>

                <p className="wizard-description">
                    Please create your restaurant details. Once
                    submitted, it will be pending approval from
                    the Admin.
                </p>
            </div>

            <form
                onSubmit={handleCreateRestaurant}
                className="wizard-form"
            >

                {/* Restaurant name and cuisine */}
                <div className="wizard-grid wizard-grid-2">

                    <div className="wizard-field">
                        <label>Restaurant Name</label>

                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. L'Artiste"
                        />
                    </div>

                    <div className="wizard-field">
                        <label>Cuisine Type</label>

                        <input
                            type="text"
                            required
                            value={cuisine}
                            onChange={(e) =>
                                setCuisine(e.target.value)
                            }
                            placeholder="e.g. French, Omakase"
                        />
                    </div>

                </div>

                {/* Description */}
                <div className="wizard-field">
                    <label>Description</label>

                    <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the dining experience, atmosphere, and dining philosophy..."
                    />
                </div>

                {/* Cover image upload */}
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
                                Upload a high-resolution banner photo
                                for your restaurant page. Supports
                                JPG and PNG.
                            </p>

                            <label className="wizard-upload-button">
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
                                <span className="wizard-selected-file">
                                    Selected: {imageFile.name}
                                </span>
                            )}
                        </div>

                    </div>
                </div>

                {/* Price, location and seating capacity */}
                <div className="wizard-grid wizard-grid-3">

                    <div className="wizard-field">
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

                    <div className="wizard-field">
                        <label>Location (City)</label>

                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            placeholder="e.g. Mumbai"
                        />
                    </div>

                    <div className="wizard-field">
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
                <div className="wizard-grid wizard-grid-2">

                    <div className="wizard-field">
                        <label>Address</label>

                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                            placeholder="Restaurant street address"
                        />
                    </div>

                    <div className="wizard-field">
                        <label>Executive Chef</label>

                        <input
                            type="text"
                            required
                            value={chef}
                            onChange={(e) =>
                                setChef(e.target.value)
                            }
                            placeholder="Chef name"
                        />
                    </div>

                </div>

                {/* Restaurant tags */}
                <div className="wizard-field">
                    <label>Tags (comma separated)</label>

                    <input
                        type="text"
                        value={tags}
                        onChange={(e) =>
                            setTags(e.target.value)
                        }
                        placeholder="Michelin Star, Romantic, Rooftop"
                    />
                </div>

                {/* Available reservation slots */}
                <div className="wizard-field">
                    <label>Available Slots</label>

                    <div className="wizard-slots">
                        {defaultSlots.map((slot) => {
                            const isSelected =
                                availableSlots.includes(slot);

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