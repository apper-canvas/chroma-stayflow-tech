import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { reservationService, roomService } from '@/services';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const AddReservationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    room_id: '',
    check_in: '',
    check_out: '',
    status: 'confirmed',
    total_amount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableRooms();
    }
  }, [isOpen]);

  const loadAvailableRooms = async () => {
    setLoadingRooms(true);
    try {
      const rooms = await roomService.getAvailableRooms();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load available rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

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

    // Auto-calculate total amount based on room selection and dates
    if (name === 'room_id' || name === 'check_in' || name === 'check_out') {
      calculateTotal({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateTotal = (data) => {
    if (data.room_id && data.check_in && data.check_out) {
      const room = availableRooms.find(r => r.Id === parseInt(data.room_id));
      if (room) {
        const checkIn = new Date(data.check_in);
        const checkOut = new Date(data.check_out);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
          const total = nights * room.rate;
          setFormData(prev => ({
            ...prev,
            total_amount: total.toFixed(2)
          }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.guest_name.trim()) {
      newErrors.guest_name = 'Guest name is required';
    }

    if (!formData.guest_email.trim()) {
      newErrors.guest_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) {
      newErrors.guest_email = 'Email is invalid';
    }

    if (!formData.guest_phone.trim()) {
      newErrors.guest_phone = 'Phone number is required';
    }

    if (!formData.room_id) {
      newErrors.room_id = 'Room selection is required';
    }

    if (!formData.check_in) {
      newErrors.check_in = 'Check-in date is required';
    }

    if (!formData.check_out) {
      newErrors.check_out = 'Check-out date is required';
    }

    if (formData.check_in && formData.check_out) {
      const checkIn = new Date(formData.check_in);
      const checkOut = new Date(formData.check_out);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        newErrors.check_in = 'Check-in date cannot be in the past';
      }

      if (checkOut <= checkIn) {
        newErrors.check_out = 'Check-out date must be after check-in date';
      }
    }

    if (!formData.total_amount) {
      newErrors.total_amount = 'Total amount is required';
    } else if (isNaN(formData.total_amount) || parseFloat(formData.total_amount) < 0) {
      newErrors.total_amount = 'Total amount must be a valid positive number';
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
      const reservationData = {
        Name: `Reservation for ${formData.guest_name}`,
        guest_name: formData.guest_name.trim(),
        guest_email: formData.guest_email.trim(),
        guest_phone: formData.guest_phone.trim(),
        room_id: parseInt(formData.room_id),
        check_in: formData.check_in, // DateTime format expected by API
        check_out: formData.check_out, // DateTime format expected by API
        status: formData.status,
        total_amount: parseFloat(formData.total_amount),
        notes: formData.notes.trim()
      };

      const result = await reservationService.create(reservationData);
      
      if (result) {
        toast.success('Reservation created successfully!');
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      room_id: '',
      check_in: '',
      check_out: '',
      status: 'confirmed',
      total_amount: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  // Get minimum date (today) for date inputs
  const today = format(new Date(), 'yyyy-MM-dd');

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
                New Reservation
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
              {/* Guest Information */}
              <div>
                <h3 className="text-lg font-medium text-surface-900 mb-4">Guest Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Guest Name <span className="text-error">*</span>
                    </label>
                    <Input
                      name="guest_name"
                      value={formData.guest_name}
                      onChange={handleInputChange}
                      placeholder="Enter guest's full name"
                      error={errors.guest_name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Email <span className="text-error">*</span>
                    </label>
                    <Input
                      type="email"
                      name="guest_email"
                      value={formData.guest_email}
                      onChange={handleInputChange}
                      placeholder="guest@example.com"
                      error={errors.guest_email}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Phone Number <span className="text-error">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="guest_phone"
                      value={formData.guest_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      error={errors.guest_phone}
                    />
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div>
                <h3 className="text-lg font-medium text-surface-900 mb-4">Reservation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Room <span className="text-error">*</span>
                    </label>
                    <select
                      name="room_id"
                      value={formData.room_id}
                      onChange={handleInputChange}
                      disabled={loadingRooms}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                        errors.room_id ? 'border-error' : 'border-surface-300'
                      }`}
                    >
                      <option value="">
                        {loadingRooms ? 'Loading rooms...' : 'Select a room'}
                      </option>
                      {availableRooms.map(room => (
                        <option key={room.Id} value={room.Id}>
                          Room {room.number} - {room.type} (${room.rate}/night)
                        </option>
                      ))}
                    </select>
                    {errors.room_id && (
                      <p className="mt-1 text-sm text-error">{errors.room_id}</p>
                    )}
                  </div>

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
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Check-in Date <span className="text-error">*</span>
                    </label>
                    <Input
                      type="date"
                      name="check_in"
                      value={formData.check_in}
                      onChange={handleInputChange}
                      min={today}
                      error={errors.check_in}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Check-out Date <span className="text-error">*</span>
                    </label>
                    <Input
                      type="date"
                      name="check_out"
                      value={formData.check_out}
                      onChange={handleInputChange}
                      min={formData.check_in || today}
                      error={errors.check_out}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Total Amount <span className="text-error">*</span>
                    </label>
                    <Input
                      type="number"
                      name="total_amount"
                      value={formData.total_amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      error={errors.total_amount}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Additional notes or special requests..."
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>
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
                  {loading ? 'Creating...' : 'Create Reservation'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddReservationModal;