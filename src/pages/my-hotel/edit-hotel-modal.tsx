// --- src/pages/my-hotel/EditHotelModal.tsx (Conceptually) ---
import React, { useState } from "react";
import { Edit3, CheckCircle, PlusCircle, Trash2, X } from "lucide-react";

interface EditHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  onSave: (updatedHotel: Hotel) => void;
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({
  isOpen,
  onClose,
  hotel,
  onSave,
}) => {
  const [editedHotel, setEditedHotel] = React.useState<Hotel>({ ...hotel });
  const [newAmenity, setNewAmenity] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setEditedHotel({ ...hotel }); // Reset form with current hotel data when opened
    }
  }, [isOpen, hotel]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedHotel((prev) => ({
      ...prev,
      [name]:
        name === "starRating" || name === "latitude" || name === "longitude"
          ? Number(value)
          : value,
    }));
  };

  const handleAmenityChange = (index: number, value: string) => {
    const updatedAmenities = [...editedHotel.amenities];
    updatedAmenities[index] = value;
    setEditedHotel((prev) => ({ ...prev, amenities: updatedAmenities }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setEditedHotel((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setEditedHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedHotel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl transform transition-all max-w-3xl w-full max-h-[90vh] relative">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-2xl font-semibold text-sky-400 flex items-center">
            <Edit3 className="mr-3 h-6 w-6" /> Edit Hotel Information
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-sky-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-140px)] p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            {/* Hotel Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Hotel Name
              </label>
              <input
                type="text"
                name="name"
                value={editedHotel.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            {/* Hotel Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Hotel Type
              </label>
              <input
                type="text"
                name="hotel_type"
                value={editedHotel.hotel_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editedHotel.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                name="zipcode"
                value={editedHotel.zipcode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Star Rating
              </label>
              <select
                name="starRating"
                value={editedHotel.starRating}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={editedHotel.latitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={editedHotel.longitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              name="hotelDescription"
              value={editedHotel.hotelDescription}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
            />
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amenities
            </label>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
              {editedHotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) => handleAmenityChange(index, e.target.value)}
                    required
                    className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="p-2.5 text-red-400 hover:text-red-300 bg-slate-700 hover:bg-red-500/20 rounded-lg transition-colors"
                    aria-label="Remove amenity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity"
                className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none mr-2"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors flex items-center"
                aria-label="Add amenity"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add
              </button>
            </div>
          </div>

          {/* Contact (Optional fields added for demonstration) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                name="contactEmail"
                value={editedHotel.contactEmail || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={editedHotel.contactPhone || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors font-medium flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;
