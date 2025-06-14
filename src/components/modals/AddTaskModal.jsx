import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { housekeepingService, roomService } from '@/services';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const AddTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    room_id: '',
    type: '',
    priority: 'medium',
    assigned_to: '',
    status: 'pending',
    scheduled_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const taskTypes = [
    'Cleaning',
    'Deep Cleaning',
    'Maintenance',
    'Inspection',
    'Turnover',
    'Laundry',
    'Restocking',
    'Repair'
  ];

  const staff = [
    'Maria Garcia',
    'John Smith',
    'Sarah Johnson',
    'Carlos Rodriguez',
    'Lisa Chen',
    'David Wilson'
  ];

  useEffect(() => {
    if (isOpen) {
      loadRooms();
      // Set default scheduled time to current time + 1 hour
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      setFormData(prev => ({
        ...prev,
        scheduled_time: format(defaultTime, 'yyyy-MM-dd\'T\'HH:mm')
      }));
    }
  }, [isOpen]);

  const loadRooms = async () => {
    setLoadingRooms(true);
    try {
      const roomData = await roomService.getAll();
      setRooms(roomData);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load rooms');
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.room_id) {
      newErrors.room_id = 'Room selection is required';
    }

    if (!formData.type) {
      newErrors.type = 'Task type is required';
    }

    if (!formData.assigned_to.trim()) {
      newErrors.assigned_to = 'Staff assignment is required';
    }

    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Scheduled time is required';
    } else {
      const scheduledDate = new Date(formData.scheduled_time);
      const now = new Date();
      if (scheduledDate < now) {
        newErrors.scheduled_time = 'Scheduled time cannot be in the past';
      }
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
      const selectedRoom = rooms.find(r => r.Id === parseInt(formData.room_id));
      const taskData = {
        Name: `${formData.type} - Room ${selectedRoom?.number || formData.room_id}`,
        room_id: parseInt(formData.room_id),
        type: formData.type,
        priority: formData.priority,
        assigned_to: formData.assigned_to.trim(),
        status: formData.status,
        scheduled_time: formData.scheduled_time, // DateTime format expected by API
        completed_time: null // Will be set when task is completed
      };

      const result = await housekeepingService.create(taskData);
      
      if (result) {
        toast.success('Task created successfully!');
        onSuccess?.();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      room_id: '',
      type: '',
      priority: 'medium',
      assigned_to: '',
      status: 'pending',
      scheduled_time: ''
    });
    setErrors({});
    onClose();
  };

  // Get minimum date/time (now) for datetime input
  const now = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm');

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
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">
                Create New Task
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
              {/* Room Selection */}
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
                  {rooms.map(room => (
                    <option key={room.Id} value={room.Id}>
                      Room {room.number} - {room.type} (Floor {room.floor})
                    </option>
                  ))}
                </select>
                {errors.room_id && (
                  <p className="mt-1 text-sm text-error">{errors.room_id}</p>
                )}
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Task Type <span className="text-error">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.type ? 'border-error' : 'border-surface-300'
                  }`}
                >
                  <option value="">Select task type</option>
                  {taskTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-error">{errors.type}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Assigned Staff */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Assign to <span className="text-error">*</span>
                </label>
                <select
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.assigned_to ? 'border-error' : 'border-surface-300'
                  }`}
                >
                  <option value="">Select staff member</option>
                  {staff.map(person => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
                {errors.assigned_to && (
                  <p className="mt-1 text-sm text-error">{errors.assigned_to}</p>
                )}
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Scheduled Time <span className="text-error">*</span>
                </label>
                <Input
                  type="datetime-local"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleInputChange}
                  min={now}
                  error={errors.scheduled_time}
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
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
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
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;