import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [propertySettings, setPropertySettings] = useState({
    propertyName: 'Grand Hotel & Resort',
    address: '123 Luxury Avenue, Resort City, RC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@grandhotel.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD',
    taxRate: '12.5'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    checkInReminders: true,
    maintenanceAlerts: true,
    lowOccupancyAlerts: false
  });

  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    autoRefresh: true
  });

  const handlePropertyChange = (field, value) => {
    setPropertySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    toast.info('Settings reset to defaults');
  };

  const handleExportData = () => {
    toast.info('Exporting data...');
  };

  const handleImportData = () => {
    toast.info('Opening import dialog...');
  };

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
            Settings
          </h1>
          <p className="text-surface-600 mt-1">
            Configure your property and system preferences
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon="RotateCcw"
            onClick={handleResetSettings}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            icon="Save"
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Property Information
                </h2>
                <p className="text-sm text-surface-600">
                  Basic property details and configuration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Property Name"
                value={propertySettings.propertyName}
                onChange={(e) => handlePropertyChange('propertyName', e.target.value)}
                required
              />
              <Input
                label="Address"
                value={propertySettings.address}
                onChange={(e) => handlePropertyChange('address', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  value={propertySettings.phone}
                  onChange={(e) => handlePropertyChange('phone', e.target.value)}
                  icon="Phone"
                />
                <Input
                  label="Email"
                  type="email"
                  value={propertySettings.email}
                  onChange={(e) => handlePropertyChange('email', e.target.value)}
                  icon="Mail"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Check-in Time"
                  type="time"
                  value={propertySettings.checkInTime}
                  onChange={(e) => handlePropertyChange('checkInTime', e.target.value)}
                  icon="Clock"
                />
                <Input
                  label="Check-out Time"
                  type="time"
                  value={propertySettings.checkOutTime}
                  onChange={(e) => handlePropertyChange('checkOutTime', e.target.value)}
                  icon="Clock"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={propertySettings.currency}
                    onChange={(e) => handlePropertyChange('currency', e.target.value)}
                    className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.1"
                  value={propertySettings.taxRate}
                  onChange={(e) => handlePropertyChange('taxRate', e.target.value)}
                  icon="Percent"
                />
              </div>
            </div>
          </Card>

          {/* User Preferences */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  User Preferences
                </h2>
                <p className="text-sm text-surface-600">
                  Customize your experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={userPreferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Language
                  </label>
                  <select
                    value={userPreferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={userPreferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Time Format
                  </label>
                  <select
                    value={userPreferences.timeFormat}
                    onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                    className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="12-hour">12-hour</option>
                    <option value="24-hour">24-hour</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <p className="font-medium text-surface-900">Auto Refresh</p>
                  <p className="text-sm text-surface-600">
                    Automatically refresh data every 30 seconds
                  </p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoRefresh', !userPreferences.autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userPreferences.autoRefresh ? 'bg-primary' : 'bg-surface-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      userPreferences.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications & Data Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Notification Settings */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" size={20} className="text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Notifications
                </h2>
                <p className="text-sm text-surface-600">
                  Configure alert preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                { key: 'checkInReminders', label: 'Check-in Reminders', description: 'Alerts for upcoming check-ins' },
                { key: 'maintenanceAlerts', label: 'Maintenance Alerts', description: 'Notifications for maintenance issues' },
                { key: 'lowOccupancyAlerts', label: 'Low Occupancy Alerts', description: 'Alerts when occupancy drops below threshold' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div>
                    <p className="font-medium text-surface-900">{label}</p>
                    <p className="text-sm text-surface-600">{description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key, !notificationSettings[key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings[key] ? 'bg-primary' : 'bg-surface-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Management */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Database" size={20} className="text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Data Management
                </h2>
                <p className="text-sm text-surface-600">
                  Import and export your data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-50 rounded-lg">
                <h3 className="font-medium text-surface-900 mb-2">
                  Export Data
                </h3>
                <p className="text-sm text-surface-600 mb-4">
                  Download your property data for backup or analysis
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    icon="Download"
                    size="sm"
                    onClick={handleExportData}
                    className="justify-center"
                  >
                    Export Reservations
                  </Button>
                  <Button
                    variant="outline"
                    icon="Download"
                    size="sm"
                    onClick={handleExportData}
                    className="justify-center"
                  >
                    Export Rooms
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-surface-50 rounded-lg">
                <h3 className="font-medium text-surface-900 mb-2">
                  Import Data
                </h3>
                <p className="text-sm text-surface-600 mb-4">
                  Upload data from external systems or backups
                </p>
                <Button
                  variant="primary"
                  icon="Upload"
                  size="sm"
                  onClick={handleImportData}
                  className="w-full justify-center"
                >
                  Import Data
                </Button>
              </div>

              <div className="p-4 bg-error/10 rounded-lg border border-error/20">
                <h3 className="font-medium text-error mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-surface-600 mb-4">
                  Actions in this section cannot be undone
                </p>
                <Button
                  variant="danger"
                  icon="Trash2"
                  size="sm"
                  onClick={() => toast.error('This action is not available in demo mode')}
                  className="w-full justify-center"
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;