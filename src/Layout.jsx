import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { routeArray } from "@/config/routes";
import { AuthContext } from "@/App";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeProfileDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMyProfile = () => {
    navigate("/settings");
    closeProfileDropdown();
  };

  const handleLogout = async () => {
    closeProfileDropdown();
    await logout();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
    {/* Header */}
    <header
        className="flex-shrink-0 h-16 bg-surface border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors">
                    <ApperIcon name="Menu" size={20} className="text-primary" />
                </button>
                <div className="flex items-center space-x-3">
                    <div
                        className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Hotel" size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-heading font-semibold text-primary">StayFlow
                                      </h1>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative">
                    <ApperIcon name="Bell" size={20} className="text-surface-600" />
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">3
                    </span>
                </button>
<div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleProfileDropdown}
                        className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary-dark transition-colors">
                        <ApperIcon name="User" size={16} className="text-primary" />
                    </button>
                    
                    <AnimatePresence>
                        {profileDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-50">
                                <button
                                    onClick={handleMyProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center space-x-2">
                                    <ApperIcon name="User" size={16} />
                                    <span>My Profile</span>
                                </button>
                                <hr className="my-1 border-surface-200" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 transition-colors flex items-center space-x-2">
                                    <ApperIcon name="LogOut" size={16} />
                                    <span>Logout</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    </header>
    <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
            className="hidden lg:block w-64 bg-surface border-r border-surface-200 z-40">
            <nav className="h-full overflow-y-auto p-4">
                <div className="space-y-2">
                    {routeArray.map(route => <NavLink
                        key={route.id}
                        to={route.path}
                        className={(
                            {
                                isActive
                            }
                        ) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-surface-600 hover:bg-surface-100 hover:text-primary"}`}>
                        <ApperIcon name={route.icon} size={20} />
                        <span className="font-medium">{route.label}</span>
                    </NavLink>)}
                </div>
            </nav>
        </aside>
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {mobileMenuOpen && <>
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={closeMobileMenu} />
                <motion.aside
                    initial={{
                        x: -280
                    }}
                    animate={{
                        x: 0
                    }}
                    exit={{
                        x: -280
                    }}
                    transition={{
                        type: "tween",
                        duration: 0.3
                    }}
                    className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-surface-200 z-50">
                    <div
                        className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <ApperIcon name="Hotel" size={20} className="text-white" />
                            </div>
                            <h1 className="text-xl font-heading font-semibold text-primary">StayFlow
                                                    </h1>
                        </div>
                        <button
                            onClick={closeMobileMenu}
                            className="p-2 rounded-lg hover:bg-surface-100 transition-colors">
                            <ApperIcon name="X" size={20} className="text-surface-600" />
                        </button>
                    </div>
                    <nav className="p-4">
                        <div className="space-y-2">
                            {routeArray.map(route => <NavLink
                                key={route.id}
                                to={route.path}
                                onClick={closeMobileMenu}
                                className={(
                                    {
                                        isActive
                                    }
                                ) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-primary text-white shadow-md" : "text-surface-600 hover:bg-surface-100 hover:text-primary"}`}>
                                <ApperIcon name={route.icon} size={20} />
                                <span className="font-medium">{route.label}</span>
                            </NavLink>)}
                        </div>
                    </nav>
                </motion.aside>
            </>}
        </AnimatePresence>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
            <motion.div
                key={location.pathname}
                initial={{
                    opacity: 0,
                    x: 20
                }}
                animate={{
                    opacity: 1,
                    x: 0
                }}
                exit={{
                    opacity: 0,
                    x: -20
                }}
                transition={{
                    duration: 0.3
                }}
                className="h-full">
                <Outlet />
            </motion.div>
</main>
    </div>
</div>
  );
};

export default Layout;