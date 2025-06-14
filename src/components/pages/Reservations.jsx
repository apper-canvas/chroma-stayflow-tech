import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { reservationService } from "@/services";
import ReservationCard from "@/components/molecules/ReservationCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import AddReservationModal from "@/components/modals/AddReservationModal";
const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchQuery, selectedStatus, dateFilter]);

  const loadReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationService.getAll();
      // Sort by check-in date, most recent first
      const sortedData = data.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
      setReservations(sortedData);
    } catch (err) {
      setError(err.message || 'Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(reservation =>
        reservation.guest_name.toLowerCase().includes(query) ||
        reservation.guest_email.toLowerCase().includes(query) ||
        String(reservation.room_id).toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === selectedStatus);
    }

    // Date filter
    const today = new Date();
    const todayStr = today.toDateString();
    
if (dateFilter === 'today') {
      filtered = filtered.filter(reservation =>
        new Date(reservation.check_in).toDateString() === todayStr ||
        new Date(reservation.check_out).toDateString() === todayStr
      );
    } else if (dateFilter === 'upcoming') {
      filtered = filtered.filter(reservation =>
        new Date(reservation.check_in) > today
      );
    } else if (dateFilter === 'current') {
      filtered = filtered.filter(reservation =>
        new Date(reservation.check_in) <= today &&
        new Date(reservation.check_out) >= today &&
        reservation.status === 'checked-in'
      );
    }

    setFilteredReservations(filtered);
  };

const handleCheckIn = async (reservation) => {
    try {
      await reservationService.update(reservation.Id, { status: 'checked-in' });
      toast.success(`${reservation.guest_name} checked in successfully`);
      loadReservations();
    } catch (err) {
      toast.error('Failed to check in guest');
    }
  };

const handleCheckOut = async (reservation) => {
    try {
      await reservationService.update(reservation.Id, { status: 'checked-out' });
      toast.success(`${reservation.guest_name} checked out successfully`);
      loadReservations();
    } catch (err) {
      toast.error('Failed to check out guest');
    }
  };

const handleViewDetails = (reservation) => {
    toast.info(`Viewing details for ${reservation.guest_name}`);
  };

  const getStatusStats = () => {
    return {
      all: reservations.length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      'checked-in': reservations.filter(r => r.status === 'checked-in').length,
      'checked-out': reservations.filter(r => r.status === 'checked-out').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length
    };
  };

  const stats = getStatusStats();

  const statusFilters = [
    { key: 'all', label: 'All', count: stats.all },
    { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { key: 'checked-in', label: 'Checked In', count: stats['checked-in'] },
    { key: 'checked-out', label: 'Checked Out', count: stats['checked-out'] }
  ];

  const dateFilters = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'current', label: 'Current Guests' },
    { key: 'upcoming', label: 'Upcoming' }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader count={1} className="h-8 w-48" />
          <SkeletonLoader count={1} className="h-10 w-32" />
        </div>
        <div className="bg-surface rounded-lg p-6">
          <SkeletonLoader count={1} className="h-10 w-full mb-4" />
          <div className="flex flex-wrap gap-2">
            <SkeletonLoader count={4} className="h-8 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader count={6} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadReservations} />
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No reservations found"
          description="Start by creating your first reservation"
          actionLabel="New Reservation"
          onAction={() => toast.info('Opening new reservation form...')}
          icon="Calendar"
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
            Reservations
          </h1>
          <p className="text-surface-600 mt-1">
            Manage guest bookings and check-ins
          </p>
        </div>
<div className="flex space-x-3">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadReservations}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddModal(true)}
          >
            New Reservation
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200 space-y-4"
      >
        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search by guest name, email, or room..."
            icon="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedStatus === filter.key
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

          {/* Date Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-surface-700">
              Period:
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {dateFilters.map((filter) => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          title="No reservations match your search"
          description="Try adjusting your search criteria or filters"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatus('all');
            setDateFilter('all');
          }}
          icon="Search"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReservationCard
                reservation={reservation}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Reservation Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusFilters.slice(1).map((filter) => (
            <div key={filter.key} className="text-center">
              <p className="text-2xl font-bold text-primary">
                {filter.count}
              </p>
              <p className="text-sm text-surface-600">
                {filter.label}
              </p>
</div>
          ))}
        </div>
      </motion.div>

      {/* Add Reservation Modal */}
      <AddReservationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadReservations}
/>
    </div>
  );
};

export default Reservations;