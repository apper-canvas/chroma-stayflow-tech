import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { roomService } from '@/services';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const AddRoomModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    status: 'available',
    cleaning_status: 'clean',
    floor: '',
    amenities: [],
    rate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roomTypes = [
    'Single',
    'Double',
    'Twin',
    'Queen',
    'King',
    'Suite',
    'Deluxe',
    'Executive',
    'Presidential'
  ];

  const availableAmenities = [
    'WiFi',
    'AC',
    'TV',
    'Mini Bar',
    'Balcony',
    'Ocean View',
    'Jacuzzi',
    'City View'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!formData.type) {
      newErrors.type = 'Room type is required';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor is required';
    } else if (isNaN(formData.floor) || parseInt(formData.floor) < 1) {
      newErrors.floor = 'Floor must be a positive number';
    }

    if (!formData.rate) {
      newErrors.rate = 'Rate is required';
    } else if (isNaN(formData.rate) || parseFloat(formData.rate) < 0) {
      newErrors.rate = 'Rate must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Format data for API - only include Updateable fields
      const roomData = {
        Name: `Room ${formData.number}`,
        number: formData.number.trim(),
        type: formData.type,
        status: formData.status,
        cleaning_status: formData.cleaning_status,
        floor: parseInt(formData.floor),
        amenities: formData.amenities, // Will be converted to comma-separated string in service
        rate: parseFloat(formData.rate)
      };

      const result = await roomService.create(roomData);
      
      if (result) {
        toast.success('Room created successfully!');
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      number: '',
      type: '',
      status: 'available',
      cleaning_status: 'clean',
      floor: '',
      amenities: [],
      rate: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">
                Add New Room
              </h2>
              <button
                onClick={handleClose}
                className="text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Room Number <span className="text-error">*</span>
                  </label>
                  <Input
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, A-205"
                    error={errors.number}
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Room Type <span className="text-error">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.type ? 'border-error' : 'border-surface-300'
                    }`}
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-error">{errors.type}</p>
                  )}
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Floor <span className="text-error">*</span>
                  </label>
                  <Input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2, 3"
                    min="1"
                    error={errors.floor}
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Rate per Night <span className="text-error">*</span>
                  </label>
                  <Input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    placeholder="e.g., 150.00"
                    min="0"
                    step="0.01"
                    error={errors.rate}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="checkout">Check Out</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>

                {/* Cleaning Status */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Cleaning Status
                  </label>
                  <select
                    name="cleaning_status"
                    value={formData.cleaning_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="clean">Clean</option>
                    <option value="dirty">Dirty</option>
                    <option value="inspected">Inspected</option>
                    <option value="out-of-order">Out of Order</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-surface-300 text-primary focus:ring-accent"
                      />
                      <span className="text-sm text-surface-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  icon={loading ? "Loader2" : "Plus"}
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddRoomModal;