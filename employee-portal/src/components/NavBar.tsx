import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '../store';
import { resetEmployeeForm } from '../store/slices/employeeFormSlice';
import { resetEmployee } from '../store/slices/employeeSlice';
import { resetUser } from '../store/slices/userSlice';
import { api } from '../utils/utils';

export default function NavDrawer() {
  const userStatus = useAppSelector((state) => state.user.status);
  const user = useAppSelector((state) => state.user.user);
  const employee = useAppSelector((state) => state.employee.employee);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentRoute = location.pathname;
    if (userStatus == 'failed' && currentRoute !== '/') {
      navigate('/');
    }
  }, [user, location.pathname, navigate, userStatus]);

  const handleLogout = async () => {
    await api('/user/logout', {
      method: 'post',
    });
    dispatch(resetUser());
    dispatch(resetEmployee());
    dispatch(resetEmployeeForm());
    navigate('/');
  };

  const onboarded = employee && employee.onboardingStatus == 'Approved';

  // Determine active route for highlighting
  const isActive = (path: string): boolean => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out z-10 w-64 h-full bg-white border-r border-gray-200 shadow-lg`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <span className="text-xl font-bold">Employee Portal</span>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          {user ? (
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-blue-500  flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 py-2">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white shadow"></div>
              <p className="text-sm font-medium text-gray-900">Login</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        {user && (
          <nav className="mt-5 px-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </h3>
            {onboarded ? (
              <ul className="mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/personal-info')}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg ${
                      isActive('/personal-info')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    } transition duration-150 ease-in-out`}
                  >
                    Personal Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('visa')}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg ${
                      isActive('visa')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    } transition duration-150 ease-in-out`}
                  >
                    Visa Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('housing')}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg ${
                      isActive('housing')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    } transition duration-150 ease-in-out`}
                  >
                    Housing
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="mt-2">
                <li>
                  <button
                    onClick={() => navigate('/onboard')}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium rounded-lg ${
                      isActive('/onboard')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    } transition duration-150 ease-in-out`}
                  >
                    Onboard Application
                  </button>
                </li>
              </ul>
            )}

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="text-xs text-center text-gray-500">
                <p>© 2025 Employee Portal</p>
                <p className="mt-1">Version 1.0.0</p>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
