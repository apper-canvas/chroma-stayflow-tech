import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { roomService, reservationService, housekeepingService } from '@/services';
import StatsCard from '@/components/molecules/StatsCard';
import OccupancyWidget from '@/components/organisms/OccupancyWidget';
import QuickActions from '@/components/organisms/QuickActions';
import ActivityFeed from '@/components/molecules/ActivityFeed';
import ReservationCard from '@/components/molecules/ReservationCard';
import HousekeepingCard from '@/components/molecules/HousekeepingCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todayArrivals, setTodayArrivals] = useState([]);
  const [todayDepartures, setTodayDepartures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsData, reservationsData, tasksData, arrivalsData, departuresData] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        housekeepingService.getTodayTasks(),
        reservationService.getTodayArrivals(),
        reservationService.getTodayDepartures()
      ]);

      setRooms(roomsData);
      setReservations(reservationsData);
      setTasks(tasksData);
      setTodayArrivals(arrivalsData);
      setTodayDepartures(departuresData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'new-reservation':
        toast.info('Opening new reservation form...');
        break;
      case 'check-in':
        toast.info('Opening quick check-in...');
        break;
      case 'housekeeping':
        toast.info('Opening task assignment...');
        break;
      case 'maintenance':
        toast.info('Opening maintenance report...');
        break;
      default:
        break;
    }
  };

  const handleCheckIn = async (reservation) => {
    try {
      await reservationService.update(reservation.id, { status: 'checked-in' });
      toast.success(`${reservation.guestName} checked in successfully`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to check in guest');
    }
  };

  const handleCheckOut = async (reservation) => {
    try {
      await reservationService.update(reservation.id, { status: 'checked-out' });
      toast.success(`${reservation.guestName} checked out successfully`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to check out guest');
    }
  };

  const handleTaskUpdate = async (taskId, status) => {
    try {
      const updateData = { status };
      if (status === 'completed') {
        updateData.completedTime = new Date().toISOString();
      }
      await housekeepingService.update(taskId, updateData);
      toast.success('Task updated successfully');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // Calculate stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
  
  const totalRevenue = reservations
    .filter(r => r.status === 'checked-in' || r.status === 'checked-out')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Generate activity feed
  const activities = [
    ...todayArrivals.map(reservation => ({
      id: `arrival-${reservation.id}`,
      type: 'check-in',
      title: `${reservation.guestName} arrival`,
      description: `Room ${reservation.roomId} - Expected at ${format(new Date(reservation.checkIn), 'h:mm a')}`,
      timestamp: reservation.checkIn
    })),
    ...todayDepartures.map(reservation => ({
      id: `departure-${reservation.id}`,
      type: 'check-out',
      title: `${reservation.guestName} departure`,
      description: `Room ${reservation.roomId} - Expected at ${format(new Date(reservation.checkOut), 'h:mm a')}`,
      timestamp: reservation.checkOut
    })),
    ...tasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      type: task.type.includes('maintenance') ? 'maintenance' : 'cleaning',
      title: `${task.type.replace('-', ' ')} - Room ${task.roomId}`,
      description: `Assigned to ${task.assignedTo} - ${task.status}`,
      timestamp: task.scheduledTime
    }))
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).slice(0, 8);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader count={4} type="card" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonLoader count={3} type="card" />
          </div>
          <div className="space-y-6">
            <SkeletonLoader count={2} type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">
            Dashboard
          </h1>
          <p className="text-surface-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-surface-600">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
          <p className="text-lg font-semibold text-primary">
            {format(new Date(), 'h:mm a')}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Rooms"
          value={totalRooms}
          icon="Bed"
          trend={85}
        />
        <StatsCard
          title="Occupied"
          value={occupiedRooms}
          icon="Users"
          change={`${Math.round((occupiedRooms / totalRooms) * 100)}% occupancy`}
          changeType="positive"
        />
        <StatsCard
          title="Available"
          value={availableRooms}
          icon="CheckCircle"
          change={`${availableRooms} ready for guests`}
          changeType="positive"
        />
        <StatsCard
          title="Revenue Today"
          value={`$${totalRevenue.toFixed(2)}`}
          icon="DollarSign"
          change="+12% from yesterday"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Today's Arrivals */}
          {todayArrivals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
            >
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Today's Arrivals ({todayArrivals.length})
              </h3>
              <div className="space-y-4">
                {todayArrivals.slice(0, 3).map((reservation, index) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ReservationCard
                      reservation={reservation}
                      onCheckIn={handleCheckIn}
                      onViewDetails={(res) => toast.info(`Viewing details for ${res.guestName}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Urgent Tasks */}
          {tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
            >
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Urgent Tasks
              </h3>
              <div className="space-y-4">
                {tasks
                  .filter(t => t.priority === 'high' && t.status !== 'completed')
                  .slice(0, 2)
                  .map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <HousekeepingCard
                        task={task}
                        onUpdateStatus={handleTaskUpdate}
                        onViewDetails={(task) => toast.info(`Viewing task details for Room ${task.roomId}`)}
                      />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Occupancy Widget */}
          <OccupancyWidget
            totalRooms={totalRooms}
            occupiedRooms={occupiedRooms}
            availableRooms={availableRooms}
          />

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Today's Activity
            </h3>
            <div className="max-h-96 overflow-y-auto">
              <ActivityFeed activities={activities} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;