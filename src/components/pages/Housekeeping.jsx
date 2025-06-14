import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { housekeepingService } from '@/services';
import HousekeepingCard from '@/components/molecules/HousekeepingCard';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, selectedStatus, selectedPriority, selectedType]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await housekeepingService.getAll();
      // Sort by priority (high first) and then by scheduled time
      const sortedData = data.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(a.scheduledTime) - new Date(b.scheduledTime);
      });
      setTasks(sortedData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load housekeeping tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(task => task.type === selectedType);
    }

    setFilteredTasks(filtered);
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const updateData = { status };
      if (status === 'completed') {
        updateData.completedTime = new Date().toISOString();
      }
      await housekeepingService.update(taskId, updateData);
      
      const statusMessages = {
        'in-progress': 'Task started',
        'completed': 'Task completed successfully',
        'pending': 'Task reset to pending'
      };
      
      toast.success(statusMessages[status] || 'Task updated');
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleViewDetails = (task) => {
    toast.info(`Viewing task details for Room ${task.roomId}`);
  };

  const handleCreateTask = () => {
    toast.info('Opening task creation form...');
  };

  const getStatusStats = () => {
    return {
      all: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const getPriorityStats = () => {
    return {
      all: tasks.length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };
  };

  const getTaskTypes = () => {
    const types = [...new Set(tasks.map(task => task.type))];
    return types;
  };

  const stats = getStatusStats();
  const priorityStats = getPriorityStats();
  const taskTypes = getTaskTypes();

  const statusFilters = [
    { key: 'all', label: 'All Tasks', count: stats.all },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'in-progress', label: 'In Progress', count: stats['in-progress'] },
    { key: 'completed', label: 'Completed', count: stats.completed }
  ];

  const priorityFilters = [
    { key: 'all', label: 'All Priorities' },
    { key: 'high', label: 'High Priority', count: priorityStats.high },
    { key: 'medium', label: 'Medium Priority', count: priorityStats.medium },
    { key: 'low', label: 'Low Priority', count: priorityStats.low }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SkeletonLoader count={1} className="h-8 w-48" />
          <SkeletonLoader count={1} className="h-10 w-32" />
        </div>
        <div className="bg-surface rounded-lg p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <SkeletonLoader count={4} className="h-8 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SkeletonLoader count={4} className="h-8 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <SkeletonLoader count={6} type="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadTasks} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No housekeeping tasks found"
          description="Create your first task to get started with housekeeping management"
          actionLabel="Create Task"
          onAction={handleCreateTask}
          icon="Sparkles"
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
            Housekeeping
          </h1>
          <p className="text-surface-600 mt-1">
            Manage cleaning tasks and room maintenance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadTasks}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </div>
      </motion.div>

      {/* Task Board Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Status Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">Status:</label>
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
                  {filter.count !== undefined && (
                    <Badge variant="secondary" size="sm" className="ml-2">
                      {filter.count}
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Priority and Type Filters */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-surface-700">
                Priority:
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {priorityFilters.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-surface-700">
                Type:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Types</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task Board */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match your filters"
          description="Try adjusting your filters to see more tasks"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedStatus('all');
            setSelectedPriority('all');
            setSelectedType('all');
          }}
          icon="Filter"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HousekeepingCard
                task={task}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Task Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Task Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.pending}
            </p>
            <p className="text-sm text-surface-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {stats['in-progress']}
            </p>
            <p className="text-sm text-surface-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {stats.completed}
            </p>
            <p className="text-sm text-surface-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">
              {priorityStats.high}
            </p>
            <p className="text-sm text-surface-600">High Priority</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Housekeeping;