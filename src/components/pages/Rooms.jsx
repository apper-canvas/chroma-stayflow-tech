import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { roomService } from '@/services';
import RoomCard from '@/components/molecules/RoomCard';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedFloor, setSelectedFloor] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, selectedFilter, selectedFloor]);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = [...rooms];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(room => room.status === selectedFilter);
    }

    if (selectedFloor !== 'all') {
      filtered = filtered.filter(room => room.floor === parseInt(selectedFloor));
    }

    setFilteredRooms(filtered);
  };

  const handleStatusChange = async (room) => {
    const statusOptions = ['available', 'occupied', 'maintenance', 'checkout', 'reserved'];
    const currentIndex = statusOptions.indexOf(room.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];

try {
      await roomService.update(room.Id, { status: nextStatus });
      toast.success(`Room ${room.number} status updated to ${nextStatus}`);
      loadRooms();
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  const handleViewDetails = (room) => {
    toast.info(`Viewing details for Room ${room.number}`);
  };

  const getStatusStats = () => {
    return {
      all: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      checkout: rooms.filter(r => r.status === 'checkout').length,
      reserved: rooms.filter(r => r.status === 'reserved').length
    };
  };

  const getFloors = () => {
    const floors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);
    return floors;
  };

  const stats = getStatusStats();
  const floors = getFloors();

  const filters = [
    { key: 'all', label: 'All Rooms', count: stats.all },
    { key: 'available', label: 'Available', count: stats.available },
    { key: 'occupied', label: 'Occupied', count: stats.occupied },
    { key: 'checkout', label: 'Check Out', count: stats.checkout },
    { key: 'maintenance', label: 'Maintenance', count: stats.maintenance },
    { key: 'reserved', label: 'Reserved', count: stats.reserved }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader count={1} className="h-8 w-48" />
          <SkeletonLoader count={1} className="h-10 w-32" />
        </div>
        <div className="flex flex-wrap gap-2">
          <SkeletonLoader count={6} className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SkeletonLoader count={8} type="room" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadRooms} />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No rooms found"
          description="Get started by adding your first room to the system"
          actionLabel="Add Room"
          onAction={() => toast.info('Opening add room form...')}
          icon="Bed"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">
            Room Management
          </h1>
          <p className="text-surface-600 mt-1">
            Manage room status and availability
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadRooms}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => toast.info('Opening add room form...')}
          >
            Add Room
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                {filter.label}
                <Badge variant="secondary" size="sm" className="ml-2">
                  {filter.count}
                </Badge>
              </motion.button>
            ))}
          </div>

          {/* Floor Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-surface-700">
              Floor:
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Floors</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Room Grid */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          title="No rooms match your filters"
          description="Try adjusting your filters to see more rooms"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedFilter('all');
            setSelectedFloor('all');
          }}
          icon="Filter"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RoomCard
                room={room}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Room Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Room Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filters.slice(1).map((filter) => (
            <div key={filter.key} className="text-center">
              <p className="text-2xl font-bold text-primary">
                {filter.count}
              </p>
              <p className="text-sm text-surface-600 capitalize">
                {filter.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Rooms;