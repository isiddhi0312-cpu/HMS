import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  CalendarCheck, 
  MessageSquareWarning, 
  LogOut,
  Menu,
  X,
  Utensils,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Students', icon: Users, path: '/students', adminOnly: true },
    { name: 'Rooms', icon: BedDouble, path: '/rooms' },
    { name: 'Attendance', icon: CalendarCheck, path: '/attendance' },
    { name: 'Complaints', icon: MessageSquareWarning, path: '/complaints' },
    { name: 'Mess Menu', icon: Utensils, path: '/mess' },
    { name: 'Contacts', icon: Phone, path: '/contacts' },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-indigo-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white shadow-xl flex flex-col ${isMobile ? 'absolute' : 'relative'}`}
          >
            <div className="p-6 border-b border-indigo-800">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BedDouble className="text-indigo-400" />
                HMS
              </h1>
              <p className="text-indigo-300 text-sm mt-1">Hostel Management</p>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 p-3 bg-indigo-800 rounded-lg mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {filteredItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                      }`
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-4 border-t border-indigo-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-indigo-200 hover:bg-red-600/20 hover:text-red-300 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
