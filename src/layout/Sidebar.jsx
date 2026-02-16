import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Target, 
  CheckSquare, 
  Calendar, 
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'staff', 'brand_representative', 'contractor', 'supplier'] },
  { name: 'Contacts', href: '/contacts', icon: Users, roles: ['admin', 'staff'] },
  { name: 'Leads', href: '/leads', icon: Target, roles: ['admin', 'staff'] },
  { name: 'Projects', href: '/projects', icon: Briefcase, roles: ['admin', 'staff', 'contractor', 'brand_representative'] },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, roles: ['admin', 'staff', 'contractor'] },
  { name: 'Events', href: '/events', icon: Bell, roles: ['admin', 'staff'] },
  { name: 'Calendar', href: '/calendar', icon: Calendar, roles: ['admin', 'staff'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, userProfile } = useAuth();
  const { hasAnyRole } = usePermissions();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    hasAnyRole(item.roles)
  );

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar with frosted glass effect */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/60 backdrop-blur-xl border-r border-gray-200/50 px-6 pb-4 shadow-apple">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-apple-blue to-apple-purple bg-clip-text text-transparent">
            Inexss CRM
          </h1>
        </div>

        {/* User Profile Section */}
        {userProfile && (
          <div className="px-3 py-4 bg-gradient-to-r from-apple-blue/10 to-apple-purple/10 rounded-2xl border border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white font-semibold shadow-apple">
                {userProfile.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile.role === 'admin' ? 'Owner' : 
                   userProfile.role === 'staff' ? `Staff • ${userProfile.location}` :
                   userProfile.role === 'brand_representative' ? 'Brand Rep' :
                   userProfile.role === 'contractor' ? 'Architect' :
                   userProfile.role === 'supplier' ? 'Supplier' : userProfile.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-apple-blue to-apple-indigo text-white shadow-apple'
                              : 'text-gray-700 hover:text-apple-blue hover:bg-gray-100/50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-apple-blue'}`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Settings at bottom */}
            <li className="mt-auto">
              <Link
                to="/settings"
                className="group -mx-2 flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-100/50 hover:text-apple-blue transition-all duration-200"
              >
                <Settings
                  className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-apple-blue"
                  aria-hidden="true"
                />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="group -mx-2 flex w-full gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut
                  className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-600"
                  aria-hidden="true"
                />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
