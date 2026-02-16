import { Link, useLocation } from 'react-router-dom';
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

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Events', href: '/events', icon: Bell },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
];

export default function Sidebar() {
  const location = useLocation();

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

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
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
